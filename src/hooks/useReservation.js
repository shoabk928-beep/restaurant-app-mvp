import { useState } from 'react';
import { mockTables, mockReservations } from '../data/tables';

export const useReservation = () => {
  const [tables] = useState(mockTables);
  const [reservations, setReservations] = useState(mockReservations);

  const getAvailableTables = (date, timeSlot, partySize) => {
    return tables.filter((table) => {
      if (table.capacity < partySize || !table.isAvailable) return false;

      const isBooked = reservations.some(
        (res) =>
          res.tableId === table.id &&
          res.date === date &&
          res.timeSlot === timeSlot &&
          res.status !== 'Cancelled'
      );

      return !isBooked;
    });
  };

  const createReservation = ({ userId, customerName, phone, date, timeSlot, partySize, tableId }) => {
    const newReservation = {
      id: `r_${Date.now()}`,
      userId,
      customerName,
      phone,
      date,
      timeSlot,
      partySize,
      tableId,
      status: 'Confirmed',
    };

    setReservations((prev) => [...prev, newReservation]);
    return newReservation;
  };

  const cancelReservation = (id) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: 'Cancelled' } : res))
    );
  };

  return {
    tables,
    reservations,
    getAvailableTables,
    createReservation,
    cancelReservation,
  };
};