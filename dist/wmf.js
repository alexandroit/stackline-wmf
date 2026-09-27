var WMF = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    draw_canvas: () => draw_canvas,
    get_actions: () => get_actions,
    image_size: () => image_size,
    render_canvas: () => render_canvas
  });

  // src/util.ts
  /*! wmf.js (C) 2020-present SheetJS LLC -- https://sheetjs.com */
  var has_buf = !!(typeof Buffer !== "undefined" && typeof process !== "undefined" && typeof process.versions !== "undefined" && process.versions.node);
  var Buffer_from;
  if (typeof Buffer !== "undefined") {
    let nbfs = !Buffer.from;
    if (!nbfs) try {
      Buffer.from("foo", "utf8");
    } catch (e) {
      nbfs = true;
    }
    Buffer_from = nbfs ? ((buf, enc) => enc ? new Buffer(buf, enc) : new Buffer(buf)) : Buffer.from.bind(Buffer);
    if (!Buffer.alloc) Buffer.alloc = function(n) {
      return new Buffer(n);
    };
    if (!Buffer.allocUnsafe) Buffer.allocUnsafe = function(n) {
      return new Buffer(n);
    };
  }
  var chr0 = /\u0000/g;
  var read_double_le = (b, idx) => {
    const s = 1 - 2 * (b[idx + 7] >>> 7);
    let e = ((b[idx + 7] & 127) << 4) + (b[idx + 6] >>> 4 & 15);
    let m = b[idx + 6] & 15;
    for (let i = 5; i >= 0; --i) m = m * 256 + b[idx + i];
    if (e == 2047) return m == 0 ? s * Infinity : NaN;
    if (e == 0) e = -1022;
    else {
      e -= 1023;
      m += Math.pow(2, 52);
    }
    return s * Math.pow(2, e - 52) * m;
  };
  var write_double_le = (b, v, idx) => {
    const bs = (v < 0 || 1 / v == -Infinity ? 1 : 0) << 7;
    let e = 0, m = 0;
    const av = bs ? -v : v;
    if (!isFinite(av)) {
      e = 2047;
      m = isNaN(v) ? 26985 : 0;
    } else if (av == 0) e = m = 0;
    else {
      e = Math.floor(Math.log(av) / Math.LN2);
      m = av * Math.pow(2, 52 - e);
      if (e <= -1023 && (!isFinite(m) || m < Math.pow(2, 52))) {
        e = -1022;
      } else {
        m -= Math.pow(2, 52);
        e += 1023;
      }
    }
    for (let i = 0; i <= 5; ++i, m /= 256) b[idx + i] = m & 255;
    b[idx + 6] = (e & 15) << 4 | m & 15;
    b[idx + 7] = e >> 4 | bs;
  };
  var __toBuffer = (bufs) => {
    const x = [];
    for (let i = 0; i < bufs[0].length; ++i) if (bufs[0][i])
      for (let j = 0, L = bufs[0][i].length; j < L; j += 10240) x.push(...bufs[0][i].slice(j, j + 10240));
    return x;
  };
  var ___toBuffer = __toBuffer;
  var __readUInt8 = (b, idx) => b[idx];
  var __readUInt16LE = (b, idx) => b[idx + 1] * (1 << 8) + b[idx];
  var __readInt16LE = (b, idx) => {
    const u = b[idx + 1] * (1 << 8) + b[idx];
    return u < 32768 ? u : (65535 - u + 1) * -1;
  };
  var __readUInt32LE = (b, idx) => b[idx + 3] * (1 << 24) + (b[idx + 2] << 16) + (b[idx + 1] << 8) + b[idx];
  var __readInt32LE = (b, idx) => b[idx + 3] << 24 | b[idx + 2] << 16 | b[idx + 1] << 8 | b[idx];
  var __readInt32BE = (b, idx) => b[idx] << 24 | b[idx + 1] << 16 | b[idx + 2] << 8 | b[idx + 3];
  var __utf16le = (b, s, e) => {
    const ss = [];
    for (let i = s; i < e; i += 2) ss.push(String.fromCharCode(__readUInt16LE(b, i)));
    return ss.join("").replace(chr0, "");
  };
  var ___utf16le = __utf16le;
  var __hexlify = function(b, s, l) {
    const ss = [];
    for (let i = s; i < s + l; ++i) ss.push(("0" + b[i].toString(16)).slice(-2));
    return ss.join("");
  };
  var ___hexlify = __hexlify;
  var __utf8 = function(b, s, e) {
    const ss = [];
    for (let i = s; i < e; i++) ss.push(String.fromCharCode(__readUInt8(b, i)));
    return ss.join("");
  };
  var ___utf8 = __utf8;
  var __lpstr = function(b, i) {
    const len = __readUInt32LE(b, i);
    return len > 0 ? __utf8(b, i + 4, i + 4 + len - 1) : "";
  };
  var ___lpstr = __lpstr;
  var __cpstr = function(b, i) {
    const len = __readUInt32LE(b, i);
    return len > 0 ? __utf8(b, i + 4, i + 4 + len - 1) : "";
  };
  var ___cpstr = __cpstr;
  var __lpwstr = function(b, i) {
    const len = 2 * __readUInt32LE(b, i);
    return len > 0 ? __utf8(b, i + 4, i + 4 + len - 1) : "";
  };
  var ___lpwstr = __lpwstr;
  var __lpp4;
  var ___lpp4;
  __lpp4 = ___lpp4 = function lpp4_(b, i) {
    const len = __readUInt32LE(b, i);
    return len > 0 ? __utf16le(b, i + 4, i + 4 + len) : "";
  };
  var ___8lpp4 = function(b, i) {
    const len = __readUInt32LE(b, i);
    return len > 0 ? __utf8(b, i + 4, i + 4 + len) : "";
  };
  var __8lpp4 = ___8lpp4;
  var ___double = (b, idx) => read_double_le(b, idx);
  var __double = ___double;
  if (has_buf) {
    __utf16le = (b, s, e) => !Buffer.isBuffer(b) ? ___utf16le(b, s, e) : b.toString("utf16le", s, e).replace(chr0, "");
    __hexlify = (b, s, l) => Buffer.isBuffer(b) ? b.toString("hex", s, s + l) : ___hexlify(b, s, l);
    __lpstr = (b, i) => {
      if (!Buffer.isBuffer(b)) return ___lpstr(b, i);
      const len = b.readUInt32LE(i);
      return len > 0 ? b.toString("utf8", i + 4, i + 4 + len - 1) : "";
    };
    __cpstr = (b, i) => {
      if (!Buffer.isBuffer(b)) return ___cpstr(b, i);
      const len = b.readUInt32LE(i);
      return len > 0 ? b.toString("utf8", i + 4, i + 4 + len - 1) : "";
    };
    __lpwstr = (b, i) => {
      if (!Buffer.isBuffer(b)) return ___lpwstr(b, i);
      const len = 2 * b.readUInt32LE(i);
      return b.toString("utf16le", i + 4, i + 4 + len - 1);
    };
    __lpp4 = (b, i) => {
      if (!Buffer.isBuffer(b)) return ___lpp4(b, i);
      const len = b.readUInt32LE(i);
      return b.toString("utf16le", i + 4, i + 4 + len);
    };
    __8lpp4 = (b, i) => {
      if (!Buffer.isBuffer(b)) return ___8lpp4(b, i);
      const len = b.readUInt32LE(i);
      return b.toString("utf8", i + 4, i + 4 + len);
    };
    __utf8 = (b, s, e) => Buffer.isBuffer(b) ? b.toString("utf8", s, e) : ___utf8(b, s, e);
    __toBuffer = (bufs) => bufs[0].length > 0 && Buffer.isBuffer(bufs[0][0]) ? Buffer.concat(bufs[0]) : ___toBuffer(bufs);
    __double = (b, i) => Buffer.isBuffer(b) ? b.readDoubleLE(i) : ___double(b, i);
  }
  function ReadShift(size, t) {
    let o = "", oI = 0, oR, w, vv, i, loc;
    const oo = [];
    switch (t) {
      case "dbcs":
        loc = this.l;
        if (has_buf && Buffer.isBuffer(this)) o = this.slice(this.l, this.l + 2 * size).toString("utf16le");
        else for (i = 0; i < size; ++i) {
          o += String.fromCharCode(__readUInt16LE(this, loc));
          loc += 2;
        }
        size *= 2;
        break;
      case "utf8":
        o = __utf8(this, this.l, this.l + size);
        break;
      case "utf16le":
        size *= 2;
        o = __utf16le(this, this.l, this.l + size);
        break;
      case "wstr":
        return ReadShift.call(this, size, "dbcs");
      /* [MS-OLEDS] 2.1.4 LengthPrefixedAnsiString */
      case "lpstr-ansi":
        o = __lpstr(this, this.l);
        size = 4 + __readUInt32LE(this, this.l);
        break;
      case "lpstr-cp":
        o = __cpstr(this, this.l);
        size = 4 + __readUInt32LE(this, this.l);
        break;
      /* [MS-OLEDS] 2.1.5 LengthPrefixedUnicodeString */
      case "lpwstr":
        o = __lpwstr(this, this.l);
        size = 4 + 2 * __readUInt32LE(this, this.l);
        break;
      /* [MS-OFFCRYPTO] 2.1.2 Length-Prefixed Padded Unicode String (UNICODE-LP-P4) */
      case "lpp4":
        size = 4 + __readUInt32LE(this, this.l);
        o = __lpp4(this, this.l);
        if (size & 2) size += 2;
        break;
      /* [MS-OFFCRYPTO] 2.1.3 Length-Prefixed UTF-8 String (UTF-8-LP-P4) */
      case "8lpp4":
        size = 4 + __readUInt32LE(this, this.l);
        o = __8lpp4(this, this.l);
        if (size & 3) size += 4 - (size & 3);
        break;
      case "cstr":
        size = 0;
        o = "";
        while ((w = __readUInt8(this, this.l + size++)) !== 0) oo.push(String.fromCharCode(w));
        o = oo.join("");
        break;
      case "_wstr":
        size = 0;
        o = "";
        while ((w = __readUInt16LE(this, this.l + size)) !== 0) {
          oo.push(String.fromCharCode(w));
          size += 2;
        }
        size += 2;
        o = oo.join("");
        break;
      /* sbcs and dbcs support continue records in the SST way TODO codepages */
      case "dbcs-cont":
        o = "";
        loc = this.l;
        for (i = 0; i < size; ++i) {
          if (this.lens && this.lens.indexOf(loc) !== -1) {
            w = __readUInt8(this, loc);
            this.l = loc + 1;
            vv = ReadShift.call(this, size - i, w ? "dbcs-cont" : "sbcs-cont");
            return oo.join("") + vv;
          }
          oo.push(String.fromCharCode(__readUInt16LE(this, loc)));
          loc += 2;
        }
        o = oo.join("");
        size *= 2;
        break;
      case "cpstr":
      /* falls through */
      case "sbcs-cont":
        o = "";
        loc = this.l;
        for (i = 0; i != size; ++i) {
          if (this.lens && this.lens.indexOf(loc) !== -1) {
            w = __readUInt8(this, loc);
            this.l = loc + 1;
            vv = ReadShift.call(this, size - i, w ? "dbcs-cont" : "sbcs-cont");
            return oo.join("") + vv;
          }
          oo.push(String.fromCharCode(__readUInt8(this, loc)));
          loc += 1;
        }
        o = oo.join("");
        break;
      default:
        switch (size) {
          case 1:
            oI = __readUInt8(this, this.l);
            this.l++;
            return oI;
          case 2:
            oI = (t === "i" ? __readInt16LE : __readUInt16LE)(this, this.l);
            this.l += 2;
            return oI;
          case 4:
          case -4:
            if (t === "i" || (this[this.l + 3] & 128) === 0) {
              oI = (size > 0 ? __readInt32LE : __readInt32BE)(this, this.l);
              this.l += 4;
              return oI;
            } else {
              oR = __readUInt32LE(this, this.l);
              this.l += 4;
            }
            return oR;
          case 8:
          case -8:
            if (t === "f") {
              if (size == 8) oR = __double(this, this.l);
              else oR = __double([this[this.l + 7], this[this.l + 6], this[this.l + 5], this[this.l + 4], this[this.l + 3], this[this.l + 2], this[this.l + 1], this[this.l + 0]], 0);
              this.l += 8;
              return oR;
            } else size = 8;
          /* falls through */
          case 16:
            o = __hexlify(this, this.l, size);
            break;
        }
    }
    this.l += size;
    return o;
  }
  var __writeUInt32LE = (b, val, idx) => {
    b[idx] = val & 255;
    b[idx + 1] = val >>> 8 & 255;
    b[idx + 2] = val >>> 16 & 255;
    b[idx + 3] = val >>> 24 & 255;
  };
  var __writeInt32LE = (b, val, idx) => {
    b[idx] = val & 255;
    b[idx + 1] = val >> 8 & 255;
    b[idx + 2] = val >> 16 & 255;
    b[idx + 3] = val >> 24 & 255;
  };
  var __writeUInt16LE = (b, val, idx) => {
    b[idx] = val & 255;
    b[idx + 1] = val >>> 8 & 255;
  };
  function WriteShift(t, val, f) {
    let size = 0, i = 0;
    if (f === "dbcs") {
      if (typeof val !== "string") throw new Error("expected string");
      for (i = 0; i != val.length; ++i) __writeUInt16LE(this, val.charCodeAt(i), this.l + 2 * i);
      size = 2 * val.length;
    } else if (f === "sbcs") {
      {
        val = val.replace(/[^\x00-\x7F]/g, "_");
        for (i = 0; i != val.length; ++i) this[this.l + i] = val.charCodeAt(i) & 255;
      }
      size = val.length;
    } else if (f === "hex") {
      for (; i < t; ++i) {
        this[this.l++] = parseInt(val.slice(2 * i, 2 * i + 2), 16) || 0;
      }
      return this;
    } else if (f === "utf16le") {
      const end = Math.min(this.l + t, this.length);
      for (i = 0; i < Math.min(val.length, t); ++i) {
        const cc = val.charCodeAt(i);
        this[this.l++] = cc & 255;
        this[this.l++] = cc >> 8;
      }
      while (this.l < end) this[this.l++] = 0;
      return this;
    } else if (typeof val === "number") switch (t) {
      case 1:
        size = 1;
        this[this.l] = val & 255;
        break;
      case 2:
        size = 2;
        this[this.l] = val & 255;
        val >>>= 8;
        this[this.l + 1] = val & 255;
        break;
      case 3:
        size = 3;
        this[this.l] = val & 255;
        val >>>= 8;
        this[this.l + 1] = val & 255;
        val >>>= 8;
        this[this.l + 2] = val & 255;
        break;
      case 4:
        size = 4;
        __writeUInt32LE(this, val, this.l);
        break;
      case 8:
        size = 8;
        if (f === "f") {
          write_double_le(this, val, this.l);
          break;
        }
      /* falls through */
      case 16:
        break;
      case -4:
        size = 4;
        __writeInt32LE(this, val, this.l);
        break;
    }
    this.l += size;
    return this;
  }
  function CheckField(hexstr, fld) {
    const m = __hexlify(this, this.l, hexstr.length >> 1);
    if (m !== hexstr) throw new Error(fld + "Expected " + hexstr + " saw " + m);
    this.l += hexstr.length >> 1;
  }
  var prep_blob = (blob, pos) => {
    blob.l = pos;
    blob.read_shift = ReadShift;
    blob.chk = CheckField;
    blob.write_shift = WriteShift;
  };
  var __bconcat = function(bufs) {
    let is_all_arrays = true;
    for (let w = 0; w < bufs.length; ++w) if (!Array.isArray(bufs[w])) is_all_arrays = false;
    if (is_all_arrays) return [].concat(...bufs);
    let maxlen = 0, i = 0;
    for (i = 0; i < bufs.length; ++i) maxlen += bufs[i].length;
    const o = new Uint8Array(maxlen);
    for (i = 0, maxlen = 0; i < bufs.length; maxlen += bufs[i].length, ++i) o.set(bufs[i], maxlen);
    return o;
  };
  var bconcat = __bconcat;
  if (has_buf) bconcat = (bufs) => Buffer.isBuffer(bufs[0]) ? Buffer.concat(bufs) : [].concat(...bufs);

  // src/Records.ts
  /*! wmf.js (C) 2020-present SheetJS LLC -- https://sheetjs.com */
  var WMFRecords = {
    0: { n: "META_EOF" },
    // 2.3.2.1
    1574: { n: "META_ESCAPE" },
    // 2.3.6.1
    2368: { n: "META_DIBBITBLT" },
    // 2.3.1.2
    2881: { n: "META_DIBSTRETCHBLT" },
    // 2.3.1.3
    2610: { n: "META_EXTTEXTOUT" },
    // 2.3.3.5
    805: { n: "META_POLYLINE" },
    // 2.3.3.14
    804: { n: "META_POLYGON" },
    // 2.3.3.15
    1336: { n: "META_POLYPOLYGON" },
    // 2.3.3.16
    764: { n: "META_CREATEBRUSHINDIRECT" },
    // 2.3.4.1
    763: { n: "META_CREATEFONTINDIRECT" },
    // 2.3.4.2
    762: { n: "META_CREATEPENINDIRECT" },
    // 2.3.4.5
    496: { n: "META_DELETEOBJECT" },
    // 2.3.4.7
    300: { n: "META_SELECTCLIPREGION" },
    // 2.3.4.9
    301: { n: "META_SELECTOBJECT" },
    // 2.3.4.10
    1046: { n: "META_INTERSECTCLIPRECT" },
    // 2.3.5.3
    53: { n: "META_REALIZEPALETTE" },
    // 2.3.5.8
    295: { n: "META_RESTOREDC" },
    // 2.3.5.10
    30: { n: "META_SAVEDC" },
    // 2.3.5.11
    258: { n: "META_SETBKMODE" },
    // 2.3.5.15
    259: { n: "META_SETMAPMODE" },
    // 2.3.5.17
    55: { n: "META_SETPALENTRIES" },
    // 2.3.5.19
    262: { n: "META_SETPOLYFILLMODE" },
    // 2.3.5.20
    263: { n: "META_SETSTRETCHBLTMODE" },
    // 2.3.5.23
    302: { n: "META_SETTEXTALIGN" },
    // 2.3.5.24
    521: { n: "META_SETTEXTCOLOR" },
    // 2.3.5.26
    524: { n: "META_SETWINDOWEXT" },
    // 2.3.5.30
    523: { n: "META_SETWINDOWORG" },
    // 2.3.5.31
    65535: { n: "META_SHEETJS" }
  };
  var WMFEscapes = {
    15: { n: "META_ESCAPE_ENHANCED_METAFILE" }
  };

  // src/wmf.ts
  /*! wmf.js (C) 2020-present SheetJS LLC -- https://sheetjs.com */
  var parse_emf = (data) => {
  };
  var parse_dib = (data) => {
    if (data.length == 0) return null;
    prep_blob(data, 0);
    const HeaderSize = data.read_shift(4);
    let Width = 0, Height = 0, Planes = 0, BitCount = 0;
    let Compression = 0, ImageSize = 0, XPelsPerMeter = 0, YPelsPerMeter = 0, ColorUsed = 0, ColorImportant = 0;
    if (HeaderSize == 12) {
      Width = data.read_shift(2);
      Height = data.read_shift(2);
    } else {
      Width = data.read_shift(4, "i");
      Height = data.read_shift(4, "i");
    }
    Planes = data.read_shift(2);
    BitCount = data.read_shift(2);
    const out = {
      Width,
      Height,
      BitCount
    };
    if (HeaderSize != 12) {
      Compression = data.read_shift(4);
      ImageSize = data.read_shift(4);
      XPelsPerMeter = data.read_shift(4, "i");
      YPelsPerMeter = data.read_shift(4, "i");
      ColorUsed = data.read_shift(4);
      ColorImportant = data.read_shift(4);
      out["Compression"] = Compression;
      if (BitCount == 24 && ImageSize > Height * 3 * Width) Width = out["Width"] = ImageSize / (Height * 3);
    }
    if (ImageSize == data.length - data.l) {
      out["ImageData"] = data.slice(data.l, data.length);
      prep_blob(out["ImageData"], 0);
    }
    return out;
  };
  var add_to_objects = (objects, obj) => {
    for (var i = 0; i < objects.length; ++i) if (!objects[i]) {
      objects[i] = obj;
      return;
    }
    objects.push(obj);
  };
  var skip_placeable_header = (data) => {
    const start = data.l;
    if (data.length - start < 18) throw new Error("Header: truncated META_HEADER");
    if (data[start] === 215 && data[start + 1] === 205 && data[start + 2] === 198 && data[start + 3] === 154) {
      if (data.length - start < 40) throw new Error("Header: truncated META_PLACEABLE or META_HEADER");
      data.l += 22;
    }
    return data.l;
  };
  var get_actions_prepped_bytes = (data) => {
    skip_placeable_header(data);
    const out = [];
    let h = data.read_shift(2);
    if (h != 1 && h != 2) throw new Error(`Header: Type ${h} must be 1 or 2`);
    if ((h = data.read_shift(2)) != 9) throw new Error(`Header: HeaderSize ${h} must be 9`);
    h = data.read_shift(2);
    if (h != 256 && h != 768) throw new Error(`Header: Version ${h} must be 0x0100 or 0x0300`);
    data.l += 4;
    const NumberOfObjects = data.read_shift(2);
    let objects = Array.from({ length: NumberOfObjects }, () => null);
    data.l += 4;
    data.l += 2;
    let rt = 0;
    let escapecnt = 0;
    let CommentRecordCount = 0;
    let RemainingBytes = 0;
    let EnhancedMetafileDataSize = 0;
    let bufs = [];
    let states = [];
    let state = {};
    let sidx = -1;
    while (data.l < data.length) {
      if (data.length - data.l < 6) throw new Error("Record: truncated header");
      h = data.read_shift(4);
      const end = data.l + h * 2 - 4;
      if (h < 3 || end > data.length) throw new Error("Record: invalid size");
      rt = data.read_shift(2);
      let Record = WMFRecords[rt];
      if (rt == 0) break;
      switch (rt) {
        case 1574:
          {
            const EscapeFunction = data.read_shift(2);
            const Escape = WMFEscapes[EscapeFunction];
            switch (EscapeFunction) {
              case 15:
                {
                  const ByteCount = data.read_shift(2);
                  let tmp = data.read_shift(4);
                  if (tmp != 1128680791) throw `Escape: Comment ID 0x${tmp.toString(16)} != 0x43464D57`;
                  tmp = data.read_shift(4);
                  if (tmp != 1) throw `Escape: Comment Type 0x${tmp.toString(16)} != 0x00000001`;
                  tmp = data.read_shift(4);
                  if (tmp != 65536) throw `Escape: Version 0x${tmp.toString(16)} != 0x00010000`;
                  const Checksum = data.read_shift(2);
                  data.l += 4;
                  if (escapecnt == 0) {
                    CommentRecordCount = data.read_shift(4);
                  } else {
                    const _CommentRecordCount = data.read_shift(4);
                    if (_CommentRecordCount != CommentRecordCount) throw `Escape: CommentRecordCount ${_CommentRecordCount} != ${CommentRecordCount}`;
                  }
                  const CurrentRecordSize = data.read_shift(4);
                  const _RemainingBytes = data.read_shift(4);
                  if (escapecnt > 0 && CurrentRecordSize + _RemainingBytes != RemainingBytes) throw `Escape: ${RemainingBytes} != ${CurrentRecordSize} + ${_RemainingBytes}`;
                  RemainingBytes = _RemainingBytes;
                  const _EnhancedMetafileDataSize = data.read_shift(4);
                  if (escapecnt == 0) {
                    if (_EnhancedMetafileDataSize != CurrentRecordSize + _RemainingBytes) throw `Escape: ${_EnhancedMetafileDataSize} != ${CurrentRecordSize} + ${_RemainingBytes}`;
                    EnhancedMetafileDataSize = _EnhancedMetafileDataSize;
                  } else if (EnhancedMetafileDataSize != _EnhancedMetafileDataSize) throw `Escape: ${EnhancedMetafileDataSize} != ${_EnhancedMetafileDataSize}`;
                  if (ByteCount != end - data.l + 34) throw `Escape: Sizes ${ByteCount} != ${end - data.l} + 34`;
                  if (end - data.l != CurrentRecordSize) throw `Escape: CRSize ${CurrentRecordSize} != ${end - data.l}`;
                  bufs.push(data.slice(data.l, end));
                  ++escapecnt;
                  if (escapecnt == CommentRecordCount) {
                    const prepped = bconcat(bufs);
                    prep_blob(prepped, 0);
                    parse_emf(prepped);
                  }
                }
                break;
              default:
                throw `Escape: Unrecognized META_ESCAPE Type 0x${EscapeFunction.toString(16)}`;
            }
          }
          break;
        // #region 2.3.1 Bitmap Record Types
        case 2368:
          {
            const has_bitmap = h != (rt >> 8) + 3;
            const RasterOperation = data.read_shift(4);
            const YSrc = data.read_shift(2, "i");
            const XSrc = data.read_shift(2, "i");
            if (!has_bitmap) data.l += 2;
            const Height = data.read_shift(2, "i");
            const Width = data.read_shift(2, "i");
            const YDest = data.read_shift(2, "i");
            const XDest = data.read_shift(2, "i");
            const res = {
              t: "cpy",
              src: [[XSrc, Width], [YSrc, Height]],
              dst: [XDest, YDest],
              rop: RasterOperation,
              s: Object.assign({}, state)
            };
            if (has_bitmap) {
              const DIB = parse_dib(data.slice(data.l, end));
              res.data = DIB;
            }
            out.push(res);
          }
          break;
        case 2881:
          {
            const has_bitmap = h != (rt >> 8) + 3;
            const RasterOperation = data.read_shift(4);
            const SrcHeight = data.read_shift(2, "i");
            const SrcWidth = data.read_shift(2, "i");
            const YSrc = data.read_shift(2, "i");
            const XSrc = data.read_shift(2, "i");
            if (!has_bitmap) data.l += 2;
            const DestHeight = data.read_shift(2, "i");
            const DestWidth = data.read_shift(2, "i");
            const YDest = data.read_shift(2, "i");
            const XDest = data.read_shift(2, "i");
            const res = {
              t: "str",
              src: [[XSrc, SrcWidth], [YSrc, SrcHeight]],
              dst: [[XDest, DestWidth], [YDest, DestHeight]],
              rop: RasterOperation,
              s: Object.assign({}, state)
            };
            if (has_bitmap) {
              const DIB = parse_dib(data.slice(data.l, end));
              res.data = DIB;
            }
            out.push(res);
          }
          break;
        // #endregion
        // #region 2.3.3 Drawing Record Types
        case 2610:
          {
            const Y = data.read_shift(2);
            const X = data.read_shift(2);
            const StringLength = data.read_shift(2);
            const fwOpts = data.read_shift(2);
            if (fwOpts & 6) {
              data.l += 8;
            }
            const str = data.read_shift(StringLength, "cpstr");
            if (data.l < end) {
            }
            out.push({ t: "text", v: str, p: [X, Y], s: Object.assign({}, state) });
          }
          break;
        case 805:
        // 2.3.3.14 META_POLYLINE
        case 804:
          {
            const nPoints = data.read_shift(2);
            const points = [];
            for (let i = 0; i < nPoints; ++i) points.push([data.read_shift(2), data.read_shift(2)]);
            out.push({ t: "poly", p: points, g: rt !== 805, s: Object.assign({}, state) });
          }
          break;
        case 1336:
          {
            const nPolygons = data.read_shift(2);
            const polys = [];
            const szs = [];
            for (let i = 0; i < nPolygons; ++i) szs[i] = data.read_shift(2);
            for (let i = 0; i < szs.length; ++i) {
              polys[i] = [];
              for (let j = 0; j < szs[i]; ++j) polys[i].push([data.read_shift(2), data.read_shift(2)]);
              out.push({ t: "poly", p: polys[i], g: true, s: Object.assign({}, state) });
            }
          }
          break;
        // #endregion
        // #region 2.3.4 Object Record Types
        case 764:
          {
            const obj = {};
            obj.Brush = {
              Style: data.read_shift(2),
              Color: data.read_shift(4),
              Hatch: data.read_shift(2)
            };
            add_to_objects(objects, obj);
          }
          break;
        case 763:
          {
            const obj = {};
            obj.Font = {};
            const Height = data.read_shift(2, "i");
            const Width = data.read_shift(2, "i");
            const Escapement = data.read_shift(2, "i");
            const Orientation = data.read_shift(2, "i");
            const Weight = data.read_shift(2, "i");
            const Italic = !!data.read_shift(1);
            const Underline = !!data.read_shift(1);
            const StrikeOut = !!data.read_shift(1);
            const CharSet = data.read_shift(1);
            const OutPrecision = data.read_shift(1);
            const ClipPrecision = data.read_shift(1);
            const Quality = data.read_shift(1);
            const PitchAndFamily = data.read_shift(1);
            const Facename = data.read_shift(32, "cstr");
            obj.Font.Name = Facename;
            obj.Font.Height = Height;
            obj.Font.Weight = Weight;
            obj.Font.Italic = Italic;
            obj.Font.Angle = Escapement / 10;
            add_to_objects(objects, obj);
          }
          break;
        case 762:
          {
            const obj = {};
            obj.Pen = {
              Style: data.read_shift(2),
              Width: data.read_shift(4) & 255,
              Color: data.read_shift(4)
            };
            add_to_objects(objects, obj);
          }
          break;
        case 496:
          {
            const ObjectIndex = data.read_shift(2);
            objects[ObjectIndex] = null;
          }
          break;
        case 300:
          {
            const Region = data.read_shift(2);
          }
          break;
        case 301:
          {
            const ObjectIndex = data.read_shift(2);
            Object.assign(state, objects[ObjectIndex]);
          }
          break;
        // #endregion
        // #region 2.3.5 State Record Types
        case 1046:
          state.ClipRect = [[0, 0], [0, 0]];
          state.ClipRect[1][1] = data.read_shift(2);
          state.ClipRect[1][0] = data.read_shift(2);
          state.ClipRect[0][1] = data.read_shift(2);
          state.ClipRect[0][0] = data.read_shift(2);
          break;
        case 295:
          {
            const nSavedDC = data.read_shift(2, "i");
            state = states[sidx = nSavedDC >= 0 ? nSavedDC : sidx + nSavedDC];
          }
          break;
        case 30:
          states.push(state);
          sidx = states.length - 1;
          state = JSON.parse(JSON.stringify(state));
          break;
        case 258:
          state.BkMode = data.read_shift(2);
          break;
        case 259:
          state.MapMode = data.read_shift(2);
          break;
        case 262:
          state.PolyFillMode = data.read_shift(2);
          break;
        case 263:
          state.StretchMode = data.read_shift(2);
          break;
        case 302:
          state.TextAlignmentMode = data.read_shift(2);
          break;
        case 521:
          state.TextColor = data.read_shift(4);
          break;
        case 524:
          state.Extent = [0, 0];
          state.Extent[1] = data.read_shift(2);
          state.Extent[0] = data.read_shift(2);
          break;
        case 523:
          state.Origin = [0, 0];
          state.Origin[1] = data.read_shift(2);
          state.Origin[0] = data.read_shift(2);
          break;
        // #endregion
        default:
          console.log(Record);
      }
      data.l = end;
    }
    if (rt !== 0) throw `Record: Last Record Type ${rt} is not EOF type`;
    return out;
  };
  var image_size_prepped_bytes = (data) => {
    const headerStart = skip_placeable_header(data);
    let h = data.read_shift(2);
    if (h != 1 && h != 2) throw new Error(`Header: Type ${h} must be 1 or 2`);
    if ((h = data.read_shift(2)) != 9) throw new Error(`Header: HeaderSize ${h} must be 9`);
    h = data.read_shift(2);
    if (h != 256 && h != 768) throw new Error(`Header: Version ${h} must be 0x0100 or 0x0300`);
    data.l = headerStart + 18;
    let rt = 0;
    while (data.l < data.length) {
      if (data.length - data.l < 6) throw new Error("Record: truncated header");
      h = data.read_shift(4);
      const end = data.l + h * 2 - 4;
      if (h < 3 || end > data.length) throw new Error("Record: invalid size");
      rt = data.read_shift(2);
      if (rt == 0) break;
      if (rt == 524) {
        const extents = [NaN, NaN];
        extents[1] = data.read_shift(2);
        extents[0] = data.read_shift(2);
        return extents;
      }
      data.l = end;
    }
    return [NaN, NaN];
  };

  // src/canvas.ts
  /*! wmf.js (C) 2020-present SheetJS LLC -- https://sheetjs.com */
  var css_color = (clr) => `#${(clr & 255).toString(16).padStart(2, "0")}${(clr >> 8 & 255).toString(16).padStart(2, "0")}${(clr >> 16 & 255).toString(16).padStart(2, "0")}`;
  var set_ctx_state = (ctx, state) => {
    if (!state) return;
    let font = "";
    if (state.Font) {
      if (state.Font.Italic) font += " italic";
      if (state.Font.Weight) font += ` ${state.Font.Weight == 700 ? "bold" : state.Font.Weight == 400 ? "" : state.Font.Weight}`;
      if (state.Font.Height < 0) font += ` ${-state.Font.Height}px`;
      else if (state.Font.Height > 0) font += ` ${state.Font.Height}px`;
      let name = state.Font.Name || "";
      if (name == "System") name = "Calibri";
      if (name) font += ` '${name}', sans-serif`;
      ctx.font = font.trim();
    }
  };
  var render_actions_to_context = (out, ctx) => {
    out.forEach((act) => {
      ctx.save();
      set_ctx_state(ctx, act.s);
      switch (act.t) {
        case "poly":
          ctx.beginPath();
          if (act.s.Pen.Color != null) ctx.strokeStyle = css_color(act.s.Pen.Color);
          if (act.s.Pen.Width > 0) ctx.lineWidth = act.s.Pen.Width;
          if (act.s.Brush.Color != null) ctx.fillStyle = css_color(act.s.Brush.Color);
          ctx.moveTo(act.p[0][0], act.p[0][1]);
          act.p.slice(1).forEach(([x, y]) => {
            ctx.lineTo(x, y);
          });
          if (act.g) ctx.closePath();
          if (act.s.Pen.Style != 5) ctx.stroke();
          if (act.s.Brush.Style != 1) ctx.fill();
          break;
        case "text":
          if (act.s && act.s.TextColor) ctx.fillStyle = css_color(act.s.TextColor);
          if (act.s.Font.Angle != 0) {
            ctx.translate(act.p[0], act.p[1]);
            ctx.rotate(-act.s.Font.Angle * Math.PI / 180);
            ctx.fillText(act.v, 0, 0);
            ctx.translate(-act.p[0], -act.p[1]);
          } else ctx.fillText(act.v, act.p[0], act.p[1]);
          break;
        case "cpy":
          {
            const idata = ctx.getImageData(act.src[0][0], act.src[1][0], act.src[0][1], act.src[1][1]);
            ctx.putImageData(idata, act.dst[0], act.dst[1]);
          }
          break;
        case "str": {
          if (act.data && act.data.BitCount == 24 && act.data.ImageData) {
            const _o = new Uint8ClampedArray(act.data.Width * act.data.Height * 4);
            for (let i = 0; i < act.data.Width * act.data.Height; ++i) {
              const j = i % act.data.Width + act.data.Width * (act.data.Height - 1 - Math.floor(i / act.data.Width));
              _o[4 * i] = act.data.ImageData[3 * j + 2];
              _o[4 * i + 1] = act.data.ImageData[3 * j + 1];
              _o[4 * i + 2] = act.data.ImageData[3 * j];
              _o[4 * i + 3] = 255;
            }
            const idata = new ImageData(_o, act.data.Width, act.data.Height);
            ctx.putImageData(idata, act.dst[0][0], act.dst[1][0]);
          }
        }
      }
      ctx.restore();
    });
  };
  var render_canvas = (out, image) => {
    let ctx;
    out.forEach((act) => {
      if (ctx) return;
      if (!act.s) return;
      if (!act.s.Extent || !act.s.Origin) return;
      image.width = act.s.Extent[0] - act.s.Origin[0];
      image.height = act.s.Extent[1] - act.s.Origin[1];
      ctx = image.getContext("2d");
      ctx.save();
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillRect(0, 0, act.s.Extent[0] - act.s.Origin[0], act.s.Extent[1] - act.s.Origin[1]);
      ctx.restore();
    });
    if (!ctx) ctx = image.getContext("2d");
    render_actions_to_context(out, ctx);
  };
  var draw_canvas = (data, image) => {
    if (data instanceof ArrayBuffer) return draw_canvas(new Uint8Array(data), image);
    prep_blob(data, 0);
    const out = get_actions_prepped_bytes(data);
    return render_canvas(out, image);
  };

  // src/index.ts
  /*! wmf.js (C) 2020-present SheetJS LLC -- https://sheetjs.com */
  var get_actions = (data) => {
    if (data instanceof ArrayBuffer) return get_actions(new Uint8Array(data));
    prep_blob(data, 0);
    return get_actions_prepped_bytes(data);
  };
  var image_size = (data) => {
    if (data instanceof ArrayBuffer) return image_size(new Uint8Array(data));
    prep_blob(data, 0);
    return image_size_prepped_bytes(data);
  };
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=wmf.js.map
