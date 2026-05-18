export type Equipment = {
  id: string;
  name: string;
  description?: string;
};

export type Responsible = {
  id: string;
  name: string;
};

export type Room = {
  id: string;
  name: string;
  floor?: string;
};

export type AreaInfo = {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
};

export type ReservationData = {
  id?: string;
  reservationId?: string;
  startTime: string;
  endTime: string;
  returnStart: string;
  returnEnd: string;
  area: AreaInfo;
  responsibleName?: string;
  room?: { id: string; name: string };
  reservationEquipments?: { equipment: Equipment }[];
  equipments?: string[];   // nombres, viene del broadcast WS
  responsible_name?: string;
  room_name?: string;
  status?: string;
};

export type LockData = {
  reservationId: string;
  startTime: string;
  endTime: string;
  area: AreaInfo;
};