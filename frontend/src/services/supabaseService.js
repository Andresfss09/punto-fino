import { supabase, isSupabaseConfigured } from './supabaseClient';

const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const supabaseService = {
  // ================= SERVICES =================
  async getServices() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_num', { ascending: true });
    if (error) throw error;
    // Normalizar a formato _id para compatibilidad con componentes
    return (data || []).map(s => ({
      ...s,
      _id: s.id,
    }));
  },

  // ================= BARBERS =================
  async getBarbers() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .eq('is_available', true);
    if (error) throw error;
    return (data || []).map(b => {
      let newName = b.name;
      if (newName.toUpperCase().includes('JUAN DAVID')) newName = 'Andrés Felipe Sarria';
      else if (newName.toUpperCase().includes('JUAN DIEGO')) newName = 'Nicolas Chavez';
      else if (newName.toUpperCase().includes('EMANUEL TORRES')) newName = 'Luis de Avila';
      return {

      _id: b.id,
      name: newName,
      user: {
        _id: b.profile_id || b.id,
        name: newName,
        email: b.email,
        phone: b.phone,
        avatar: b.avatar_url,
      },
      bio: b.bio,
      specialties: b.specialties,
      rating: {
        average: Number(b.rating_average || 5.0),
        count: b.rating_count || 0,
      },
      isAvailable: b.is_available,
    }));
  },

  // ================= AVAILABLE SLOTS =================
  async getAvailableSlots(date, barberId, duration = 35) {
    if (!isSupabaseConfigured()) return null;

    const baseSlots = [
      '09:00', '09:40', '10:20', '11:00', '11:40', '12:20',
      '14:00', '14:40', '15:20', '16:00', '16:40', '17:20',
      '18:00', '18:40', '19:20'
    ];

    if (!date) return baseSlots;

    try {
      let query = supabase
        .from('appointments')
        .select('start_time, status')
        .eq('date', date)
        .neq('status', 'cancelada');

      if (isUUID(barberId)) {
        query = query.eq('barber_id', barberId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Error consultando citas existentes para slots:', error);
        return baseSlots;
      }

      const bookedSlots = new Set((data || []).map(a => a.start_time));
      return baseSlots.filter(s => !bookedSlots.has(s));
    } catch (err) {
      console.warn('Fallback a slots base:', err);
      return baseSlots;
    }
  },

  // ================= APPOINTMENTS =================
  async createAppointment(appointmentData) {
    if (!isSupabaseConfigured()) return null;

    const confirmationCode = 'PF-' + Math.floor(1000 + Math.random() * 9000);

    const newAppointment = {
      confirmation_code: confirmationCode,
      client_name: appointmentData.clientName || 'Cliente',
      client_email: appointmentData.clientEmail || '',
      client_phone: appointmentData.clientPhone || '',
      client_address: appointmentData.clientAddress || 'Cali',
      is_guest: !appointmentData.clientId,
      client_id: isUUID(appointmentData.clientId) ? appointmentData.clientId : null,
      barber_id: isUUID(appointmentData.barberId) ? appointmentData.barberId : null,
      date: appointmentData.date,
      start_time: appointmentData.startTime,
      end_time: appointmentData.endTime || appointmentData.startTime,
      total_price: Number(appointmentData.totalPrice) || 0,
      total_duration: Number(appointmentData.totalDuration) || 35,
      status: 'pendiente',
      payment_method: appointmentData.paymentMethod || 'efectivo',
      notes: appointmentData.notes || '',
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(newAppointment)
      .select()
      .single();

    if (error) throw error;

    // Si tiene servicios asociados con IDs válidos UUID, insertar en appointment_services
    const servicesList = appointmentData.services || appointmentData.serviceIds || [];
    if (Array.isArray(servicesList) && servicesList.length > 0) {
      const validItems = servicesList
        .map(s => {
          const sId = typeof s === 'object' ? (s._id || s.id) : s;
          if (!isUUID(sId)) return null;
          return {
            appointment_id: data.id,
            service_id: sId,
            service_name: typeof s === 'object' && s.name ? s.name : 'Experiencia Triadix',
            price: (typeof s === 'object' && s.price) ? s.price : (appointmentData.totalPrice || 0),
            duration: (typeof s === 'object' && s.duration) ? s.duration : (appointmentData.totalDuration || 35),
          };
        })
        .filter(Boolean);

      if (validItems.length > 0) {
        try {
          await supabase.from('appointment_services').insert(validItems);
        } catch (err) {
          console.warn('Advertencia insertando appointment_services:', err);
        }
      }
    }

    return {
      appointment: {
        ...data,
        _id: data.id,
        confirmationCode: data.confirmation_code,
      },
      confirmationCode: data.confirmation_code,
    };
  },

  async getBarberAppointments(barberId, date) {
    if (!isSupabaseConfigured()) return null;

    let query = supabase
      .from('appointments')
      .select('*, appointment_services(*)');

    if (barberId) query = query.eq('barber_id', barberId);
    if (date) query = query.eq('date', date);

    const { data, error } = await query.order('start_time', { ascending: true });
    if (error) throw error;

    return (data || []).map(apt => ({
      ...apt,
      _id: apt.id,
      client: {
        name: apt.client_name,
        phone: apt.client_phone,
        email: apt.client_email,
      },
      services: (apt.appointment_services || []).map(as => ({
        name: as.service_name,
        price: as.price,
        duration: as.duration,
      })),
      totalDuration: apt.total_duration,
      totalPrice: apt.total_price,
      startTime: apt.start_time,
      status: apt.status,
      paymentMethod: apt.payment_method,
    }));
  },

  async updateAppointmentStatus(appointmentId, status) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ================= AUTH =================
  async login(email, password) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Obtener perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        _id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || 'Usuario',
        email: data.user.email,
        role: profile?.role || data.user.user_metadata?.role || 'cliente',
        phone: profile?.phone || data.user.user_metadata?.phone || '',
        avatar: profile?.avatar_url || '',
      },
      token: data.session.access_token,
    };
  },

  async register({ name, email, password, phone, role = 'cliente' }) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role,
        },
      },
    });
    if (error) throw error;

    return {
      user: {
        _id: data.user?.id,
        name,
        email,
        role,
        phone,
      },
      token: data.session?.access_token || '',
    };
  },

  async logout() {
    if (!isSupabaseConfigured()) return;
    await supabase.auth.signOut();
  },
};


