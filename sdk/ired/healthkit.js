function inRange(a,b,c){return b<=a&&a<=c}function includes(a,b){return a.indexOf(b)!==-1}var floor=Math.floor;function ToDictionary(o){if(o===undefined)return{};if(o===Object(o))return o;throw TypeError('Could not convert argument to dictionary');}function stringToCodePoints(e){var s=String(e);var n=s.length;var i=0;var u=[];while(i<n){var c=s.charCodeAt(i);if(c<0xD800||c>0xDFFF){u.push(c)}else if(0xDC00<=c&&c<=0xDFFF){u.push(0xFFFD)}else if(0xD800<=c&&c<=0xDBFF){if(i===n-1){u.push(0xFFFD)}else{var d=s.charCodeAt(i+1);if(0xDC00<=d&&d<=0xDFFF){var a=c&0x3FF;var b=d&0x3FF;u.push(0x10000+(a<<10)+b);i+=1}else{u.push(0xFFFD)}}}i+=1}return u}function codePointsToString(a){var s='';for(var i=0;i<a.length;++i){var b=a[i];if(b<=0xFFFF){s+=String.fromCharCode(b)}else{b-=0x10000;s+=String.fromCharCode((b>>10)+0xD800,(b&0x3FF)+0xDC00)}}return s}function isASCIIByte(a){return 0x00<=a&&a<=0x7F}var isASCIICodePoint=isASCIIByte;var end_of_stream=-1;function Stream(a){this.tokens=[].slice.call(a);this.tokens.reverse()}Stream.prototype={endOfStream:function(){return!this.tokens.length},read:function(){if(!this.tokens.length)return end_of_stream;return this.tokens.pop()},prepend:function(a){if(Array.isArray(a)){var b=(a);while(b.length)this.tokens.push(b.pop())}else{this.tokens.push(a)}},push:function(a){if(Array.isArray(a)){var b=(a);while(b.length)this.tokens.unshift(b.shift())}else{this.tokens.unshift(a)}}};var finished=-1;function decoderError(a,b){if(a)throw TypeError('Decoder error');return b||0xFFFD}function encoderError(a){throw TypeError('The code point '+a+' could not be encoded.');}function Decoder(){}Decoder.prototype={handler:function(a,b){}};function Encoder(){}Encoder.prototype={handler:function(a,b){}};function getEncoding(a){a=String(a).trim().toLowerCase();if(Object.prototype.hasOwnProperty.call(label_to_encoding,a)){return label_to_encoding[a]}return null}var encodings=[{"encodings":[{"labels":["unicode-1-1-utf-8","utf-8","utf8"],"name":"UTF-8"}],"heading":"The Encoding"},];var label_to_encoding={};encodings.forEach(function(c){c.encodings.forEach(function(b){b.labels.forEach(function(a){label_to_encoding[a]=b})})});var encoders={};var decoders={};function indexCodePointFor(a,b){if(!b)return null;return b[a]||null}function indexPointerFor(a,b){var c=b.indexOf(a);return c===-1?null:c}function index(a){if(!('encoding-indexes'in global)){throw Error("Indexes missing."+" Did you forget to include encoding-indexes.js first?");}return global['encoding-indexes'][a]}function indexGB18030RangesCodePointFor(a){if((a>39419&&a<189000)||(a>1237575))return null;if(a===7457)return 0xE7C7;var b=0;var c=0;var d=index('gb18030-ranges');var i;for(i=0;i<d.length;++i){var e=d[i];if(e[0]<=a){b=e[0];c=e[1]}else{break}}return c+a-b}function indexGB18030RangesPointerFor(a){if(a===0xE7C7)return 7457;var b=0;var c=0;var d=index('gb18030-ranges');var i;for(i=0;i<d.length;++i){var e=d[i];if(e[1]<=a){b=e[1];c=e[0]}else{break}}return c+a-b}function indexShiftJISPointerFor(c){shift_jis_index=shift_jis_index||index('jis0208').map(function(a,b){return inRange(b,8272,8835)?null:a});var d=shift_jis_index;return d.indexOf(c)}var shift_jis_index;function indexBig5PointerFor(c){big5_index_no_hkscs=big5_index_no_hkscs||index('big5').map(function(a,b){return(b<(0xA1-0x81)*157)?null:a});var d=big5_index_no_hkscs;if(c===0x2550||c===0x255E||c===0x2561||c===0x256A||c===0x5341||c===0x5345){return d.lastIndexOf(c)}return indexPointerFor(c,d)}var big5_index_no_hkscs;var DEFAULT_ENCODING='utf-8';function TextDecoder(a,b){if(!(this instanceof TextDecoder))throw TypeError('Called as a function. Did you forget \'new\'?');a=a!==undefined?String(a):DEFAULT_ENCODING;b=ToDictionary(b);this._encoding=null;this._decoder=null;this._ignoreBOM=false;this._BOMseen=false;this._error_mode='replacement';this._do_not_flush=false;var c=getEncoding(a);if(c===null||c.name==='replacement')throw RangeError('Unknown encoding: '+a);if(!decoders[c.name]){throw Error('Decoder not present.'+' Did you forget to include encoding-indexes.js first?');}var d=this;d._encoding=c;if(Boolean(b['fatal']))d._error_mode='fatal';if(Boolean(b['ignoreBOM']))d._ignoreBOM=true;if(!Object.defineProperty){this.encoding=d._encoding.name.toLowerCase();this.fatal=d._error_mode==='fatal';this.ignoreBOM=d._ignoreBOM}return d}if(Object.defineProperty){Object.defineProperty(TextDecoder.prototype,'encoding',{get:function(){return this._encoding.name.toLowerCase()}});Object.defineProperty(TextDecoder.prototype,'fatal',{get:function(){return this._error_mode==='fatal'}});Object.defineProperty(TextDecoder.prototype,'ignoreBOM',{get:function(){return this._ignoreBOM}})}TextDecoder.prototype.decode=function decode(b,c){var d;if(typeof b==='object'&&b instanceof ArrayBuffer){d=new Uint8Array(b)}else if(typeof b==='object'&&'buffer'in b&&b.buffer instanceof ArrayBuffer){d=new Uint8Array(b.buffer,b.byteOffset,b.byteLength)}else{d=new Uint8Array(0)}c=ToDictionary(c);if(!this._do_not_flush){this._decoder=decoders[this._encoding.name]({fatal:this._error_mode==='fatal'});this._BOMseen=false}this._do_not_flush=Boolean(c['stream']);var e=new Stream(d);var f=[];var g;while(true){var h=e.read();if(h===end_of_stream)break;g=this._decoder.handler(e,h);if(g===finished)break;if(g!==null){if(Array.isArray(g))f.push.apply(f,(g));else f.push(g)}}if(!this._do_not_flush){do{g=this._decoder.handler(e,e.read());if(g===finished)break;if(g===null)continue;if(Array.isArray(g))f.push.apply(f,(g));else f.push(g)}while(!e.endOfStream());this._decoder=null}function serializeStream(a){if(includes(['UTF-8','UTF-16LE','UTF-16BE'],this._encoding.name)&&!this._ignoreBOM&&!this._BOMseen){if(a.length>0&&a[0]===0xFEFF){this._BOMseen=true;a.shift()}else if(a.length>0){this._BOMseen=true}else{}}return codePointsToString(a)}return serializeStream.call(this,f)};function TextEncoder(a,b){if(!(this instanceof TextEncoder))throw TypeError('Called as a function. Did you forget \'new\'?');b=ToDictionary(b);this._encoding=null;this._encoder=null;this._do_not_flush=false;this._fatal=Boolean(b['fatal'])?'fatal':'replacement';var c=this;if(Boolean(b['NONSTANDARD_allowLegacyEncoding'])){a=a!==undefined?String(a):DEFAULT_ENCODING;var d=getEncoding(a);if(d===null||d.name==='replacement')throw RangeError('Unknown encoding: '+a);if(!encoders[d.name]){throw Error('Encoder not present.'+' Did you forget to include encoding-indexes.js first?');}c._encoding=d}else{c._encoding=getEncoding('utf-8');if(a!==undefined&&'console'in global){console.warn('TextEncoder constructor called with encoding label, '+'which is ignored.')}}if(!Object.defineProperty)this.encoding=c._encoding.name.toLowerCase();return c}if(Object.defineProperty){Object.defineProperty(TextEncoder.prototype,'encoding',{get:function(){return this._encoding.name.toLowerCase()}})}TextEncoder.prototype.encode=function encode(a,b){a=a===undefined?'':String(a);b=ToDictionary(b);if(!this._do_not_flush)this._encoder=encoders[this._encoding.name]({fatal:this._fatal==='fatal'});this._do_not_flush=Boolean(b['stream']);var c=new Stream(stringToCodePoints(a));var d=[];var e;while(true){var f=c.read();if(f===end_of_stream)break;e=this._encoder.handler(c,f);if(e===finished)break;if(Array.isArray(e))d.push.apply(d,(e));else d.push(e)}if(!this._do_not_flush){while(true){e=this._encoder.handler(c,c.read());if(e===finished)break;if(Array.isArray(e))d.push.apply(d,(e));else d.push(e)}this._encoder=null}return new Uint8Array(d)};function UTF8Decoder(d){var e=d.fatal;var f=0,utf8_bytes_seen=0,utf8_bytes_needed=0,utf8_lower_boundary=0x80,utf8_upper_boundary=0xBF;this.handler=function(a,b){if(b===end_of_stream&&utf8_bytes_needed!==0){utf8_bytes_needed=0;return decoderError(e)}if(b===end_of_stream)return finished;if(utf8_bytes_needed===0){if(inRange(b,0x00,0x7F)){return b}else if(inRange(b,0xC2,0xDF)){utf8_bytes_needed=1;f=b&0x1F}else if(inRange(b,0xE0,0xEF)){if(b===0xE0)utf8_lower_boundary=0xA0;if(b===0xED)utf8_upper_boundary=0x9F;utf8_bytes_needed=2;f=b&0xF}else if(inRange(b,0xF0,0xF4)){if(b===0xF0)utf8_lower_boundary=0x90;if(b===0xF4)utf8_upper_boundary=0x8F;utf8_bytes_needed=3;f=b&0x7}else{return decoderError(e)}return null}if(!inRange(b,utf8_lower_boundary,utf8_upper_boundary)){f=utf8_bytes_needed=utf8_bytes_seen=0;utf8_lower_boundary=0x80;utf8_upper_boundary=0xBF;a.prepend(b);return decoderError(e)}utf8_lower_boundary=0x80;utf8_upper_boundary=0xBF;f=(f<<6)|(b&0x3F);utf8_bytes_seen+=1;if(utf8_bytes_seen!==utf8_bytes_needed)return null;var c=f;f=utf8_bytes_needed=utf8_bytes_seen=0;return c}}function UTF8Encoder(f){var g=f.fatal;this.handler=function(a,b){if(b===end_of_stream)return finished;if(isASCIICodePoint(b))return b;var c,offset;if(inRange(b,0x0080,0x07FF)){c=1;offset=0xC0}else if(inRange(b,0x0800,0xFFFF)){c=2;offset=0xE0}else if(inRange(b,0x10000,0x10FFFF)){c=3;offset=0xF0}var d=[(b>>(6*c))+offset];while(c>0){var e=b>>(6*(c-1));d.push(0x80|(e&0x3F));c-=1}return d}}encoders['UTF-8']=function(a){return new UTF8Encoder(a)};decoders['UTF-8']=function(a){return new UTF8Decoder(a)};
let wasm;

let heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
 * @returns {any}
 */
export function get_version() {
    const ret = wasm.get_version();
    return takeObject(ret);
}

/**
 * @returns {any}
 */
export function get_thermometer_battery_command() {
    const ret = wasm.get_thermometer_battery_command();
    return takeObject(ret);
}

/**
 * @param {number} mode
 * @param {number} setting
 * @returns {any}
 */
export function get_jump_rope_mode_command(mode, setting) {
    const ret = wasm.get_jump_rope_mode_command(mode, setting);
    return takeObject(ret);
}

/**
 * @returns {any}
 */
export function get_jump_rope_stop_current_mode_command() {
    const ret = wasm.get_jump_rope_stop_current_mode_command();
    return takeObject(ret);
}

/**
 * @param {string} data
 * @returns {boolean}
 */
export function is_in_thermometer_mac_list(data) {
    const ret = wasm.is_in_thermometer_mac_list(addHeapObject(data));
    return ret !== 0;
}

/**
 * @param {string} data
 * @returns {boolean}
 */
export function is_in_oximeter_mac_list(data) {
    const ret = wasm.is_in_oximeter_mac_list(addHeapObject(data));
    return ret !== 0;
}

/**
 * @param {string} data
 * @returns {boolean}
 */
export function is_in_blood_pressure_mac_list(data) {
    const ret = wasm.is_in_blood_pressure_mac_list(addHeapObject(data));
    return ret !== 0;
}

/**
 * @param {string} data
 * @returns {boolean}
 */
export function is_in_scale_mac_list(data) {
    const ret = wasm.is_in_scale_mac_list(addHeapObject(data));
    return ret !== 0;
}

/**
 * @param {string} data
 * @returns {boolean}
 */
export function is_in_jump_rope_mac_list(data) {
    const ret = wasm.is_in_jump_rope_mac_list(addHeapObject(data));
    return ret !== 0;
}

/**
 * @param {string} data
 * @returns {boolean}
 */
export function is_in_heart_rate_monitor_mac_list(data) {
    const ret = wasm.is_in_heart_rate_monitor_mac_list(addHeapObject(data));
    return ret !== 0;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
 * @param {Function} callback
 */
export function set_thermometer_data_event_callback(callback) {
    try {
        wasm.set_thermometer_data_event_callback(addBorrowedObject(callback));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Function} callback
 */
export function set_oximeter_data_event_callback(callback) {
    try {
        wasm.set_oximeter_data_event_callback(addBorrowedObject(callback));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Function} callback
 */
export function set_blood_pressure_data_event_callback(callback) {
    try {
        wasm.set_blood_pressure_data_event_callback(addBorrowedObject(callback));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Function} callback
 */
export function set_scale_data_event_callback(callback) {
    try {
        wasm.set_scale_data_event_callback(addBorrowedObject(callback));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Function} callback
 */
export function set_jump_rope_data_event_callback(callback) {
    try {
        wasm.set_jump_rope_data_event_callback(addBorrowedObject(callback));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Function} callback
 */
export function set_heart_rate_monitor_data_event_callback(callback) {
    try {
        wasm.set_heart_rate_monitor_data_event_callback(addBorrowedObject(callback));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function is_thermometer(obj) {
    const ret = wasm.is_thermometer(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function is_oximeter(obj) {
    const ret = wasm.is_oximeter(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function is_blood_pressure_monitor(obj) {
    const ret = wasm.is_blood_pressure_monitor(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function is_scale(obj) {
    const ret = wasm.is_scale(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function is_jump_rope(obj) {
    const ret = wasm.is_jump_rope(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function get_heart_rate_monitor_id(obj) {
    const ret = wasm.get_heart_rate_monitor_id(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function is_heart_rate_monitor(obj) {
    const ret = wasm.is_heart_rate_monitor(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @returns {any}
 */
export function read_thermometer_device() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.read_thermometer_device(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} data
 * @returns {any}
 */
export function md5(data) {
    const ret = wasm.md5(addHeapObject(data));
    return takeObject(ret);
}

/**
 * @param {any} data
 * @returns {any}
 */
export function number_to_string(data) {
    const ret = wasm.number_to_string(addHeapObject(data));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function set_thermometer_device(obj) {
    const ret = wasm.set_thermometer_device(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function set_oximeter_device(obj) {
    const ret = wasm.set_oximeter_device(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function set_blood_pressure_monitor_device(obj) {
    const ret = wasm.set_blood_pressure_monitor_device(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function set_scale_device(obj) {
    const ret = wasm.set_scale_device(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function set_jump_rope_device(obj) {
    const ret = wasm.set_jump_rope_device(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function set_heart_rate_monitor_device(obj) {
    const ret = wasm.set_heart_rate_monitor_device(addHeapObject(obj));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @param {string} device_type
 * @returns {any}
 */
export function set_device(obj, device_type) {
    const ret = wasm.set_device(addHeapObject(obj), addHeapObject(device_type));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function pair_thermometer(obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.pair_thermometer(retptr, addHeapObject(obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function pair_oximeter(obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.pair_oximeter(retptr, addHeapObject(obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function pair_blood_pressure_monitor(obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.pair_blood_pressure_monitor(retptr, addHeapObject(obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function pair_heart_rate_monitor(obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.pair_heart_rate_monitor(retptr, addHeapObject(obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function pair_jump_rope(obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.pair_jump_rope(retptr, addHeapObject(obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function pair_scale(obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.pair_scale(retptr, addHeapObject(obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {any} client_id
 * @param {any} raw_data
 * @returns {any}
 */
export function parse_thermometer_data(client_id, raw_data) {
    const ret = wasm.parse_thermometer_data(addHeapObject(client_id), addHeapObject(raw_data));
    return takeObject(ret);
}

/**
 * @param {any} client_id
 * @param {any} raw_data
 * @returns {any}
 */
export function parse_oximeter_data(client_id, raw_data) {
    const ret = wasm.parse_oximeter_data(addHeapObject(client_id), addHeapObject(raw_data));
    return takeObject(ret);
}

/**
 * @param {any} client_id
 * @param {any} raw_data
 * @returns {any}
 */
export function parse_blood_pressure_data(client_id, raw_data) {
    const ret = wasm.parse_blood_pressure_data(addHeapObject(client_id), addHeapObject(raw_data));
    return takeObject(ret);
}

/**
 * @param {any} client_id
 * @param {any} raw_data
 * @returns {any}
 */
export function parse_jump_rope_data(client_id, raw_data) {
    const ret = wasm.parse_jump_rope_data(addHeapObject(client_id), addHeapObject(raw_data));
    return takeObject(ret);
}

/**
 * @param {any} client_id
 * @param {any} raw_data
 * @returns {any}
 */
export function parse_heart_rate_monitor_data(client_id, raw_data) {
    const ret = wasm.parse_heart_rate_monitor_data(addHeapObject(client_id), addHeapObject(raw_data));
    return takeObject(ret);
}

/**
 * @param {any} client_id
 * @param {any} raw_data
 * @returns {any}
 */
export function parse_heart_rate_monitor_battery_data(client_id, raw_data) {
    const ret = wasm.parse_heart_rate_monitor_battery_data(addHeapObject(client_id), addHeapObject(raw_data));
    return takeObject(ret);
}

/**
 * @param {any} obj
 * @returns {any}
 */
export function parse_scale_data(obj) {
    const ret = wasm.parse_scale_data(addHeapObject(obj));
    return takeObject(ret);
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WXWebAssembly.instantiateStreaming === 'function') {
            try {
                return await WXWebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WXWebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WXWebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WXWebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WXWebAssembly.instantiate(module, imports);

        if (instance instanceof WXWebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_apply_55d63d092a912d6f = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.apply(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_byteLength_a7781086485e29aa = function(arg0) {
        const ret = getObject(arg0).byteLength;
        return ret;
    };
    imports.wbg.__wbg_call_641db1bb5db5a579 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_charCodeAt_2dee013561ccecd0 = function(arg0, arg1) {
        const ret = getObject(arg0).charCodeAt(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_concat_4a5e81410543b8f3 = function(arg0, arg1) {
        const ret = getObject(arg0).concat(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fromCharCode_94d4e143baf4419b = function(arg0, arg1) {
        const ret = String.fromCharCode(arg0 >>> 0, arg1 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getPrototypeOf_5f6a7286bc86df66 = function(arg0) {
        const ret = Object.getPrototypeOf(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_458e874b43b18b25 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getindex_61bb13d19869849b = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_has_b89e451f638123e3 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(getObject(arg0), getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_is_8346b6c36feaf71a = function(arg0, arg1) {
        const ret = Object.is(getObject(arg0), getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_keys_ef52390b2ae0e714 = function(arg0) {
        const ret = Object.keys(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_186546c51cd61acd = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_6bb7e81f9d7713e4 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_9d771c54845e987f = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_19c25a3f2fa63a02 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_1f3a344cf3123716 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_638ebfaedbf32a5e = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newfromslice_074c56947bd43469 = function(arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_a167dcc7aaa3ba77 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_330b2eb93e4e1212 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_set_453345bcda80b89a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setindex_463dce54da013b35 = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_wbindgenbooleanget_3fe6f642c7d97746 = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? v : undefined;
        return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    };
    imports.wbg.__wbg_wbindgendebugstring_99ef257a3ddda34d = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_wbindgengt_5d4c5d18810de162 = function(arg0, arg1) {
        const ret = getObject(arg0) > getObject(arg1);
        return ret;
    };
    imports.wbg.__wbg_wbindgenlt_544155a2b3097bd5 = function(arg0, arg1) {
        const ret = getObject(arg0) < getObject(arg1);
        return ret;
    };
    imports.wbg.__wbg_wbindgennumberget_f74b4c7525ac05cb = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg_wbindgenstringget_0f16a6ddddef376f = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_wbindgenthrow_451ec1a8469d7eb6 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;



    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WXWebAssembly.Module)) {
        module = new WXWebAssembly.Module(module);
    }

    const instance = new WXWebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
