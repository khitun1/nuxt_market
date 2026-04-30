export interface Device {
  id: number;
  name: string;
  price: number;
  rating: number;
  img: File | string | null;
  typeId: number;
  brandId: number;
}

export interface DeviceInfo {
  id: number;
  title: string;
  description: string;
}
