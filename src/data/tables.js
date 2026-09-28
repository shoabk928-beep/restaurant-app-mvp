export const mockTables = [
  { id: 't1', tableNumber: 'Table 1', capacity: 2, isAvailable: true },
  { id: 't2', tableNumber: 'Table 2', capacity: 4, isAvailable: true },
  { id: 't3', tableNumber: 'Table 3', capacity: 4, isAvailable: false },
  { id: 't4', tableNumber: 'Table 4', capacity: 6, isAvailable: true },
  { id: 't5', tableNumber: 'Table 5', capacity: 8, isAvailable: true },
  { id: 't6', tableNumber: 'Table 6', capacity: 12, isAvailable: true },
];

export const mockReservations = [
  {
    id: 'r1',
    userId: 'u1',
    customerName: 'Customer User',
    phone: '0300-1234567',
    date: '2026-10-01',
    timeSlot: '19:00',
    partySize: 4,
    tableId: 't2',
    status: 'Confirmed',
  },
];