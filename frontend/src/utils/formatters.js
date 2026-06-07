export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date, options = {}) => {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
};

export const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
};

export const getStatusColor = (status) => {
  const colors = {
    pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmada: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    en_progreso: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    completada: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelada: 'bg-red-500/20 text-red-400 border-red-500/30',
    no_show: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[status] || colors.pendiente;
};

export const getStatusLabel = (status) => {
  const labels = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    en_progreso: 'En progreso',
    completada: 'Completada',
    cancelada: 'Cancelada',
    no_show: 'No asistió',
  };
  return labels[status] || status;
};

export const getDayName = (dayNumber) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayNumber];
};