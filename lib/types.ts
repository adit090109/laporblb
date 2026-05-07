export interface ParsedData {
  nama: string;
  alamat: string;
  hp: string;
  modem: string;
  sales: string;
  tikor: string;
  titik_dp_link: string;
  kode_dp: string;
  kode_dp_valid: boolean;
  layanan: string;
  panjang: string;
  req: string;
  index: number;
}

export interface FormValues {
  wo: string;
  brim: string;
  sn: string;
  modem: string;
  kode_dp_real: string;
  port: string;
  output: string;
  redaman: string;
  installerList: string;
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  ringkasan: string;
  fullText: string;
  detail: {
    nama: string;
    alamat: string;
    hp: string;
    sales: string;
    wo: string;
    brim: string;
    sn: string;
    modem: string;
    kode_dp_wo: string;
    kode_dp_real: string;
    port: string;
    output: string;
    redaman: string;
    installer: string;
    layanan: string;
    panjang: string;
  };
}
