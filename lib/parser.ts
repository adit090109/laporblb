import { findKodeDP, KODE_DP_PREFIX } from "./kode-dp-database";
import type { ParsedData } from "./types";

export function parseScheduleData(text: string): ParsedData[] {
  const blocks = text
    .split(/\n(?=\d+\.\s)/)
    .filter(b => /^\d+\.\s/.test(b.trim()));

  return blocks.map((block, i) => {
    const lines = block.trim().split("\n").map(x => x.trim()).filter(Boolean);
    let firstLine = lines[0] || "";
    firstLine = firstLine.replace(/^\d+\.\s*/, "");

    const normalizedFirst = firstLine.replace(/(?<!\d)\s*\/\s*(?!\d)/g, " - ");
    const parts = normalizedFirst.split(/\s+-\s+/).map(x => x.trim()).filter(Boolean);

    const reHP = /^(\+62|62|08)[\d\s\-]{7,14}$/;
    const reHPInline = /(\+62[\d\s\-]{8,14}|08[\d\s\-]{8,14})/g;
    const reLayanan = /home\s+\d*d|home\s+\d+\+\d+|modem\s+second|olt\s+\d+d/i;
    const reModem = /\b(BUY|RENT|SECOND)\b/i;
    const reReq = /(\*?(?:req\s+)?jam\s+[\d\.:]+|\*?req\s+jam)/i;
    const reNoise = /^(\*|-|no\s+atribut|no\s+atribute|atribut|atribute|\s*)$/i;
    
    const reJunkPart = (p: string): boolean => {
      if (reReq.test(p)) return true;
      if (reNoise.test(p)) return true;
      if (/^[\*\-\s]+$/.test(p)) return true;
      if (/^no\s+(atribut|atribute)$/i.test(p.trim())) return true;
      return false;
    };

    let nama: string | null = null;
    const hp: string[] = [];
    const alamat: string[] = [];
    let layanan: string | null = null;
    let req: string | null = null;

    parts.forEach(part => {
      const multiHP = part.split(/\s*\/\s*/).map(x => x.trim());
      const allHP = multiHP.filter(x => reHP.test(x));
      if (allHP.length > 0) {
        hp.push(...allHP);
        return;
      }

      if (reLayanan.test(part)) {
        layanan = part;
        return;
      }

      if (reReq.test(part)) {
        req = part;
        return;
      }

      if (reJunkPart(part)) return;

      if (!nama && !/\d{4,}/.test(part) && part.length > 1 && part.length < 60) {
        nama = part;
        return;
      }

      const cleanPart = part.replace(/[\*]+/g, "").replace(/\s*-\s*$/, "").trim();
      if (cleanPart) alamat.push(cleanPart);
    });

    if (!nama) nama = parts[0] || "-";

    let alamatStr = alamat
      .filter(a => !reJunkPart(a))
      .join(", ")
      .replace(/,\s*,/g, ",")
      .replace(/^,\s*|,\s*$/g, "")
      .trim() || "-";

    if (hp.length === 0) {
      const found = firstLine.match(reHPInline) || [];
      hp.push(...found.map(x => x.trim()));
    }
    const hpStr = hp.join(" / ") || "-";

    let modem = "-";
    if (layanan) {
      const mMatch = layanan.match(reModem);
      if (mMatch) modem = mMatch[1].toUpperCase();
      const lMatch = layanan.match(/(home\s+[\w\+\s]+(?:buy|rent|second)?|modem\s+second)/i);
      if (lMatch) layanan = lMatch[0].trim();
    }
    if (modem === "-" && layanan) {
      const mMatch2 = (layanan + " " + firstLine).match(reModem);
      if (mMatch2) modem = mMatch2[1].toUpperCase();
    }
    if (layanan === null) layanan = "-";

    const allLinks = block.match(/https?:\/\/[^\s)]+/g) || [];

    let tikorSalesName = "-";
    let tikorLineIdx = -1;
    for (let li = 0; li < lines.length; li++) {
      if (/tikor|titik\s*koor/i.test(lines[li])) {
        tikorLineIdx = li;
        break;
      }
    }

    let tikor = "-";
    if (tikorLineIdx >= 0) {
      const tikorLine = lines[tikorLineIdx];
      const linkInLine = tikorLine.match(/https?:\/\/[^\s)]+/);
      if (linkInLine) {
        tikor = linkInLine[0];
      } else {
        for (let li = tikorLineIdx + 1; li < lines.length && li <= tikorLineIdx + 2; li++) {
          const linkInNext = lines[li].match(/https?:\/\/[^\s)]+/);
          if (linkInNext) {
            tikor = linkInNext[0];
            break;
          }
        }
      }

      for (let li = tikorLineIdx; li < Math.min(tikorLineIdx + 3, lines.length); li++) {
        const salesM = lines[li].match(/https?:\/\/[^\s)]+\s*\(\s*([^)]+?)\s*\)/);
        if (salesM) {
          tikorSalesName = salesM[1].trim();
          break;
        }
      }
    }

    if (tikor === "-" && allLinks.length > 0) {
      tikor = allLinks[0];
    }

    if (tikorSalesName === "-") {
      const salesM = block.match(/https?:\/\/[^\s)]+\s*\(\s*([^)]+?)\s*\)/);
      if (salesM) tikorSalesName = salesM[1].trim();
    }

    const dpLineMatch = block.match(/(?:titik|pin)\s*dp\s*[:\-]?\s*(\d+)\s*M\s*\(\s*([A-Z0-9]+)\s*\)/i);
    let panjang = "-";
    let kode_dp = "-";
    let kode_dp_valid = true;
    let titikDpLink = "-";

    if (dpLineMatch) {
      panjang = dpLineMatch[1] + "M";
      const rawKode = dpLineMatch[2].toUpperCase();
      const found = findKodeDP(rawKode);
      kode_dp = rawKode;
      kode_dp_valid = found ? found.valid : KODE_DP_PREFIX.some(p => rawKode.startsWith(p));
    } else {
      const pM = block.match(/(?:titik|pin)\s*dp[^:]*:\s*(\d+)\s*M/i);
      if (pM) panjang = pM[1] + "M";
      const dpFound = findKodeDP(block.toUpperCase());
      if (dpFound) {
        kode_dp = dpFound.kode;
        kode_dp_valid = dpFound.valid;
      }
    }

    let dpLineIdx = -1;
    for (let li = 0; li < lines.length; li++) {
      if (/(?:titik|pin)\s*dp/i.test(lines[li])) {
        dpLineIdx = li;
        break;
      }
    }
    if (dpLineIdx >= 0) {
      for (let li = dpLineIdx; li < Math.min(dpLineIdx + 3, lines.length); li++) {
        const linkInDP = lines[li].match(/https?:\/\/[^\s)]+/);
        if (linkInDP && linkInDP[0] !== tikor) {
          titikDpLink = linkInDP[0];
          break;
        }
      }
    }
    if (titikDpLink === "-") {
      for (const lnk of allLinks) {
        if (lnk !== tikor) {
          titikDpLink = lnk;
          break;
        }
      }
    }

    if (alamatStr === "-") {
      for (let li = 1; li < lines.length; li++) {
        if (/\b(jl|jln|jalan|perum|gang|gg|rt|rw|blok|no\.?|nomor)\b/i.test(lines[li])
          && !(/tikor|titik|pin\s*dp|https?:/i.test(lines[li]))) {
          alamatStr = lines[li];
          break;
        }
      }
    }

    return {
      nama: nama || "-",
      alamat: alamatStr,
      hp: hpStr,
      modem: modem,
      sales: tikorSalesName,
      tikor: tikor,
      titik_dp_link: titikDpLink,
      kode_dp: kode_dp,
      kode_dp_valid: kode_dp_valid,
      layanan: layanan,
      panjang: panjang,
      req: req || "-",
      index: i + 1
    };
  });
}
