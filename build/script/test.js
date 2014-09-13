var illa;
(function (illa) {
    illa.GLOBAL = (function () {
        return this;
    })();

    illa.classByType = (function () {
        var classes = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ');
        var result = {};
        for (var i = 0, n = classes.length; i < n; i++) {
            result['[object ' + classes[i] + ']'] = classes[i].toLowerCase();
        }
        return result;
    })();

    function isString(v) {
        return typeof v == 'string';
    }
    illa.isString = isString;

    function isBoolean(v) {
        return typeof v == 'boolean';
    }
    illa.isBoolean = isBoolean;

    function isNumber(v) {
        return typeof v == 'number';
    }
    illa.isNumber = isNumber;

    function isFunction(v) {
        return typeof v == 'function';
    }
    illa.isFunction = isFunction;

    function isArray(v) {
        return illa.getType(v) == 'array';
    }
    illa.isArray = isArray;

    if (Array.isArray)
        illa.isArray = Array.isArray;

    function isUndefined(v) {
        return typeof v == 'undefined';
    }
    illa.isUndefined = isUndefined;

    function isNull(v) {
        return v === null;
    }
    illa.isNull = isNull;

    function isUndefinedOrNull(v) {
        return typeof v == 'undefined' || v === null;
    }
    illa.isUndefinedOrNull = isUndefinedOrNull;

    function isObjectNotNull(v) {
        var t = typeof v;
        return t == 'object' && v !== null || t == 'function';
    }
    illa.isObjectNotNull = isObjectNotNull;

    function getType(v) {
        var result = '';
        if (v == null) {
            result = v + '';
        } else {
            result = typeof v;
            if (result == 'object' || result == 'function') {
                result = illa.classByType[illa.classByType.toString.call(v)] || 'object';
            }
        }
        return result;
    }
    illa.getType = getType;

    function as(c, v) {
        return v instanceof c ? v : null;
    }
    illa.as = as;

    function bind(fn, obj) {
        if (!fn)
            throw 'No function.';
        return function () {
            return fn.apply(obj, arguments);
        };
    }
    illa.bind = bind;

    if (Function.prototype.bind) {
        illa.bind = function (fn, obj) {
            return fn.call.apply(fn.bind, arguments);
        };
    }
})(illa || (illa = {}));
var illa;
(function (illa) {
    var Log = (function () {
        function Log() {
        }
        Log.log = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var console = illa.GLOBAL.console;
            if (console && console.log) {
                if (console.log.apply) {
                    console.log.apply(console, args);
                } else {
                    console.log(args.join(' '));
                }
            }
        };
        Log.info = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var console = illa.GLOBAL.console;
            if (console && console.info) {
                if (console.info.apply) {
                    console.info.apply(console, args);
                } else {
                    console.info(args.join(' '));
                }
            } else {
                Log.log.apply(this, args);
            }
        };
        Log.warn = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var console = illa.GLOBAL.console;
            if (console && console.warn) {
                if (console.warn.apply) {
                    console.warn.apply(console, args);
                } else {
                    console.warn(args.join(' '));
                }
            } else {
                Log.log.apply(this, args);
            }
        };
        Log.error = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var console = illa.GLOBAL.console;
            if (console && console.error) {
                if (console.error.apply) {
                    console.error.apply(console, args);
                } else {
                    console.error(args.join(' '));
                }
            } else {
                Log.log.apply(this, args);
            }
        };
        Log.logIf = function (test) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (test) {
                Log.log.apply(this, [test].concat(args));
            }
        };
        Log.infoIf = function (test) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (test) {
                Log.info.apply(this, [test].concat(args));
            }
        };
        Log.warnIf = function (test) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (test) {
                Log.warn.apply(this, [test].concat(args));
            }
        };
        Log.errorIf = function (test) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (test) {
                Log.error.apply(this, [test].concat(args));
            }
        };
        return Log;
    })();
    illa.Log = Log;
})(illa || (illa = {}));
var berek;
(function (berek) {
    (function (jquery) {
        jquery.$ = window['jQuery'];
    })(berek.jquery || (berek.jquery = {}));
    var jquery = berek.jquery;
})(berek || (berek = {}));
var illa;
(function (illa) {
    var EventCallbackReg = (function () {
        function EventCallbackReg(callback, thisObj) {
            this.callback = callback;
            this.thisObj = thisObj;
        }
        return EventCallbackReg;
    })();
    illa.EventCallbackReg = EventCallbackReg;
})(illa || (illa = {}));
var illa;
(function (illa) {
    var EventHandler = (function () {
        function EventHandler() {
            this.callbacksByType = {};
        }
        EventHandler.prototype.getCallbackRegsByType = function (type) {
            var result = this.callbacksByType[type];
            if (!illa.isArray(result))
                result = [];
            return result;
        };

        EventHandler.prototype.getEventParent = function () {
            return null;
        };

        EventHandler.prototype.addEventCallback = function (type, cb, thisObj) {
            var reg = new illa.EventCallbackReg(cb, thisObj);
            if (illa.isArray(this.callbacksByType[type])) {
                this.removeEventCallback(type, cb, thisObj);
                this.callbacksByType[type].push(reg);
            } else {
                this.callbacksByType[type] = [reg];
            }
        };

        EventHandler.prototype.removeEventCallback = function (type, cb, thisObj) {
            var callbacks = this.callbacksByType[type];
            if (illa.isArray(callbacks)) {
                for (var i = 0, n = callbacks.length; i < n; i++) {
                    var callback = callbacks[i];
                    if (callback.callback === cb && callback.thisObj === thisObj) {
                        callbacks.splice(i, 1);
                        break;
                    }
                }
            }
        };

        EventHandler.prototype.removeAllEventCallbacks = function () {
            this.callbacksByType = {};
        };
        return EventHandler;
    })();
    illa.EventHandler = EventHandler;
})(illa || (illa = {}));
var illa;
(function (illa) {
    var Event = (function () {
        function Event(type, target) {
            this.type = type;
            this.target = target;
            this.isPropagationStopped = false;
            this.isImmediatePropagationStopped = false;
        }
        Event.prototype.dispatch = function () {
            this.processHandler(this.target);
        };

        Event.prototype.processHandler = function (handler) {
            this.currentTarget = handler;
            var callbackRegs = handler.getCallbackRegsByType(this.type).slice(0);
            for (var i = 0, n = callbackRegs.length; i < n; i++) {
                var callbackReg = callbackRegs[i];
                callbackReg.callback.call(callbackReg.thisObj, this);
                if (this.isImmediatePropagationStopped)
                    break;
            }
            if (!this.isPropagationStopped) {
                var parentHandler = handler.getEventParent();
                if (parentHandler)
                    this.processHandler(parentHandler);
            }
        };

        Event.prototype.getType = function () {
            return this.type;
        };

        Event.prototype.getTarget = function () {
            return this.target;
        };

        Event.prototype.getCurrentTarget = function () {
            return this.currentTarget;
        };

        Event.prototype.setIsPropagationStopped = function (flag) {
            this.isPropagationStopped = flag;
        };

        Event.prototype.getIsPropagationStopped = function () {
            return this.isPropagationStopped;
        };

        Event.prototype.setStopImmediatePropagation = function (flag) {
            this.isImmediatePropagationStopped = flag;
        };

        Event.prototype.getIsImmediatePropagationStopped = function () {
            return this.isImmediatePropagationStopped;
        };
        return Event;
    })();
    illa.Event = Event;
})(illa || (illa = {}));
var illa;
(function (illa) {
    var ObjectUtil = (function () {
        function ObjectUtil() {
        }
        ObjectUtil.getKeys = function (obj) {
            var result = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result.push(key);
                }
            }
            return result;
        };
        return ObjectUtil;
    })();
    illa.ObjectUtil = ObjectUtil;
})(illa || (illa = {}));
var adat;
(function (adat) {
    var IndexDescriptor = (function () {
        function IndexDescriptor(keyPath, isUnique, isMultiEntry) {
            if (typeof isUnique === "undefined") { isUnique = false; }
            if (typeof isMultiEntry === "undefined") { isMultiEntry = false; }
            this.keyPath = keyPath;
            this.isUnique = isUnique;
            this.isMultiEntry = isMultiEntry;
        }
        IndexDescriptor.prototype.applyTo = function (objectStore, name, prev) {
            if (this.getEquals(prev)) {
                this.index = prev.getIndex();
            } else {
                if (prev) {
                    this.removeFrom(objectStore, name);
                }
                this.index = objectStore.createIndex(name, this.getKeyPath(), { unique: this.getIsUnique(), multiEntry: this.getIsMultiEntry() });
            }
        };

        IndexDescriptor.prototype.removeFrom = function (objectStore, name) {
            objectStore.deleteIndex(name);
        };

        IndexDescriptor.prototype.getEquals = function (other) {
            var result = false;

            if (other instanceof IndexDescriptor && this.getKeyPath() === other.getKeyPath() && this.getIsUnique() === other.getIsUnique() && this.getIsMultiEntry() === other.getIsMultiEntry()) {
                result = true;
            }

            return result;
        };

        IndexDescriptor.prototype.getKeyPath = function () {
            return this.keyPath;
        };
        IndexDescriptor.prototype.getIsUnique = function () {
            return this.isUnique;
        };
        IndexDescriptor.prototype.getIsMultiEntry = function () {
            return this.isMultiEntry;
        };
        IndexDescriptor.prototype.getIndex = function () {
            return this.index;
        };
        return IndexDescriptor;
    })();
    adat.IndexDescriptor = IndexDescriptor;
})(adat || (adat = {}));
var adat;
(function (adat) {
    var ObjectStoreDescriptor = (function () {
        function ObjectStoreDescriptor(keyPath, autoIncrement, indexDescriptors) {
            if (typeof keyPath === "undefined") { keyPath = ''; }
            if (typeof autoIncrement === "undefined") { autoIncrement = false; }
            if (typeof indexDescriptors === "undefined") { indexDescriptors = {}; }
            this.keyPath = keyPath;
            this.autoIncrement = autoIncrement;
            this.indexDescriptors = indexDescriptors;
        }
        ObjectStoreDescriptor.prototype.applyTo = function (transaction, database, name, prev) {
            if (prev && !this.getPropertiesEqual(prev)) {
                var objectStore = transaction.objectStore(name);

                this.applyIndexDescriptors(objectStore, prev);
            } else {
                if (prev) {
                    prev.removeFrom(database, name);
                }
                var objectStore = database.createObjectStore(name, { keyPath: this.getKeyPath(), autoIncrement: this.getAutoIncrement() });

                this.applyIndexDescriptors(objectStore, null);
            }
        };

        ObjectStoreDescriptor.prototype.removeFrom = function (database, name) {
            database.deleteObjectStore(name);
        };

        ObjectStoreDescriptor.prototype.getPropertiesEqual = function (other) {
            var result = false;

            if (other instanceof ObjectStoreDescriptor && this.getKeyPath() == other.getKeyPath() && this.getAutoIncrement() == other.getAutoIncrement()) {
                result = true;
            }

            return result;
        };

        ObjectStoreDescriptor.prototype.applyIndexDescriptors = function (objectStore, prev) {
            for (var key in this.indexDescriptors) {
                if (this.indexDescriptors.hasOwnProperty(key)) {
                    var newIndexD = this.indexDescriptors[key];
                    var prevIndexD = null;

                    if (prev && prev.indexDescriptors.hasOwnProperty(key)) {
                        prevIndexD = prev.indexDescriptors[key];
                    }

                    newIndexD.applyTo(objectStore, key, prevIndexD);
                }
            }

            if (prev) {
                for (var key in prev.indexDescriptors) {
                    if (prev.indexDescriptors.hasOwnProperty(key)) {
                        var prevIndexD = prev.indexDescriptors[key];

                        if (!this.indexDescriptors.hasOwnProperty(key)) {
                            prevIndexD.removeFrom(objectStore, key);
                        }
                    }
                }
            }
        };

        ObjectStoreDescriptor.prototype.getKeyPath = function () {
            return this.keyPath;
        };
        ObjectStoreDescriptor.prototype.getAutoIncrement = function () {
            return this.autoIncrement;
        };
        ObjectStoreDescriptor.prototype.getIndexDescriptors = function () {
            return this.indexDescriptors;
        };
        return ObjectStoreDescriptor;
    })();
    adat.ObjectStoreDescriptor = ObjectStoreDescriptor;
})(adat || (adat = {}));
var adat;
(function (adat) {
    var VersionDescriptor = (function () {
        function VersionDescriptor(objectStoreDescriptors) {
            this.objectStoreDescriptors = objectStoreDescriptors;
        }
        VersionDescriptor.prototype.applyTo = function (transaction, database, prev) {
            for (var key in this.objectStoreDescriptors) {
                if (this.objectStoreDescriptors.hasOwnProperty(key)) {
                    var osd = this.objectStoreDescriptors[key];
                    var prevOSD = prev ? prev.getObjectStoreDescriptors()[key] || null : null;
                    osd.applyTo(transaction, database, key, prevOSD);
                }
            }
            if (prev) {
                for (var key in prev.objectStoreDescriptors) {
                    if (prev.objectStoreDescriptors.hasOwnProperty(key) && !this.objectStoreDescriptors.hasOwnProperty(key)) {
                        var osd = this.objectStoreDescriptors[key];
                        osd.removeFrom(database, key);
                    }
                }
            }
        };

        VersionDescriptor.prototype.getObjectStoreName = function (osd) {
            for (var name in this.objectStoreDescriptors) {
                if (this.objectStoreDescriptors.hasOwnProperty(name)) {
                    if (osd === this.objectStoreDescriptors[name]) {
                        return name;
                    }
                }
            }
            return '';
        };

        VersionDescriptor.prototype.getObjectStoreDescriptors = function () {
            return this.objectStoreDescriptors;
        };
        return VersionDescriptor;
    })();
    adat.VersionDescriptor = VersionDescriptor;
})(adat || (adat = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var adat;
(function (adat) {
    var Database = (function (_super) {
        __extends(Database, _super);
        function Database(name, versionDescriptors) {
            _super.call(this);
            this.name = name;
            this.versionDescriptors = versionDescriptors;
            this.isOpen = false;
        }
        Database.prototype.open = function () {
            if (!Database.isSupported()) {
                illa.Log.warn(this.name, 'IndexedDB not supported.');

                new illa.Event(Database.EVENT_NOT_SUPPORTED, this).dispatch();
                return;
            }

            this.openRequest = indexedDB.open(this.getName(), this.getVersion());
            this.openRequest.onblocked = illa.bind(this.onBlocked, this);
            this.openRequest.onerror = illa.bind(this.onOpenError, this);
            this.openRequest.onupgradeneeded = illa.bind(this.onUpgradeNeeded, this);
            this.openRequest.onsuccess = illa.bind(this.onOpenSuccess, this);
        };

        Database.prototype.initDatabase = function () {
            if (!this.database) {
                this.database = this.openRequest.result;
                this.database.onerror = illa.bind(this.onDatabaseError, this);
                this.database.onabort = illa.bind(this.onDatabaseAbort, this);
            }
        };

        Database.prototype.onBlocked = function (e) {
            illa.Log.warn(this.name, 'Database upgrade blocked, waiting for other instances...');

            new illa.Event(Database.EVENT_BLOCKED, this).dispatch();
        };

        Database.prototype.onOpenError = function (e) {
            illa.Log.error(this.name, 'Could not open database.');

            new illa.Event(Database.EVENT_OPEN_ERROR, this).dispatch();
        };

        Database.prototype.onUpgradeNeeded = function (e) {
            illa.Log.info(this.name, 'Upgrading database...');

            if (e.newVersion > this.getVersion()) {
                throw this.name + ' Invalid database version: ' + e.newVersion;
            }

            var transaction = this.openRequest.transaction;
            transaction.onabort = illa.bind(this.onUpgradeTransactionAbort, this);
            transaction.onerror = illa.bind(this.onUpgradeTransactionError, this);

            this.initDatabase();

            for (var version = 1, n = this.versionDescriptors.length; version <= n; version++) {
                var newVersion = this.getVersionDescriptor(version);

                if (e.oldVersion < version) {
                    var prevVersion = version > 1 ? this.getVersionDescriptor(version - 1) : null;

                    newVersion.applyTo(transaction, this.database, prevVersion);
                }
            }
        };

        Database.prototype.onOpenSuccess = function (e) {
            illa.Log.info(this.name, 'Database opened successfully.');

            this.isOpen = true;
            this.initDatabase();

            new illa.Event(Database.EVENT_OPEN_SUCCESS, this).dispatch();
        };

        Database.prototype.onUpgradeTransactionAbort = function (e) {
            illa.Log.warn(this.name, 'Aborted upgrade transaction.');
        };

        Database.prototype.onUpgradeTransactionError = function (e) {
            illa.Log.error(this.name, 'Upgrade transaction error:', e.message);
        };

        Database.prototype.onDatabaseError = function (e) {
            illa.Log.error(this.name, 'Database error:', e.message);

            new illa.Event(Database.EVENT_ERROR, this).dispatch();
        };

        Database.prototype.onDatabaseAbort = function (e) {
            illa.Log.warn(this.name, 'Aborted on database.');

            new illa.Event(Database.EVENT_ABORT, this).dispatch();
        };

        Database.isSupported = function () {
            return !!illa.GLOBAL.indexedDB;
        };

        Database.deleteDatabase = function (name) {
            if (this.isSupported()) {
                indexedDB.deleteDatabase(name);
            }
        };

        Database.prototype.getName = function () {
            return this.name;
        };
        Database.prototype.getVersionDescriptors = function () {
            return this.versionDescriptors;
        };
        Database.prototype.getVersionDescriptor = function (version) {
            return this.versionDescriptors[version - 1];
        };
        Database.prototype.getCurrentVersionDescriptor = function () {
            return this.getVersionDescriptor(this.getVersion());
        };
        Database.prototype.getVersion = function () {
            return this.getVersionDescriptors().length;
        };
        Database.prototype.getIDBDatabase = function () {
            return this.database;
        };
        Database.prototype.getIsOpen = function () {
            return this.isOpen;
        };
        Database.EVENT_BLOCKED = 'idb_Database_EVENT_BLOCKED';
        Database.EVENT_NOT_SUPPORTED = 'idb_Database_EVENT_NOT_SUPPORTED';
        Database.EVENT_OPEN_ERROR = 'idb_Database_EVENT_OPEN_ERROR';
        Database.EVENT_OPEN_SUCCESS = 'idb_Database_EVENT_OPEN_SUCCESS';
        Database.EVENT_ERROR = 'idb_Database_EVENT_ERROR';
        Database.EVENT_ABORT = 'idb_Database_EVENT_ABORT';
        return Database;
    })(illa.EventHandler);
    adat.Database = Database;
})(adat || (adat = {}));
var illa;
(function (illa) {
    var ArrayUtil = (function () {
        function ArrayUtil() {
        }
        ArrayUtil.indexOf = function (a, v, fromIndex) {
            if (Array.prototype.indexOf) {
                return Array.prototype.indexOf.call(a, v, fromIndex);
            } else {
                var length = a.length;
                if (fromIndex == null) {
                    fromIndex = 0;
                } else if (fromIndex < 0) {
                    fromIndex = Math.max(0, length + fromIndex);
                }
                for (var i = fromIndex; i < length; i++) {
                    if (a[i] === v) {
                        return i;
                    }
                }
            }
            return -1;
        };

        ArrayUtil.removeFirst = function (a, v) {
            var i = this.indexOf(a, v);
            var removed = i >= 0;
            if (removed) {
                a.splice(i, 1)[0];
            }
            return removed;
        };

        ArrayUtil.removeAll = function (a, v) {
            var removed = false;
            for (var i = a.length - 1; i >= 0; i--) {
                if (a[i] === v) {
                    a.splice(i, 1);
                    removed = true;
                }
            }
            return removed;
        };
        return ArrayUtil;
    })();
    illa.ArrayUtil = ArrayUtil;
})(illa || (illa = {}));
var adat;
(function (adat) {
    (function (TransactionMode) {
        TransactionMode[TransactionMode["READONLY"] = 0] = "READONLY";
        TransactionMode[TransactionMode["READWRITE"] = 1] = "READWRITE";
    })(adat.TransactionMode || (adat.TransactionMode = {}));
    var TransactionMode = adat.TransactionMode;
})(adat || (adat = {}));
var adat;
(function (adat) {
    var Request = (function (_super) {
        __extends(Request, _super);
        function Request(objectStoreDescriptor) {
            _super.call(this);
            this.objectStoreDescriptor = objectStoreDescriptor;
            this.name = '';
        }
        Request.prototype.processInternal = function (objectStore) {
            throw 'Unimplemented.';
        };
        Request.prototype.getTypeName = function () {
            throw 'Unimplemented.';
        };
        Request.prototype.getMode = function () {
            throw 'Unimplemented.';
        };

        Request.prototype.process = function (objectStore) {
            this.requests = this.processInternal(objectStore);

            for (var i = 0, n = this.requests.length; i < n; i++) {
                var request = this.requests[i];
                request.onerror = illa.bind(this.onError, this);
                request.onsuccess = illa.bind(this.onSuccess, this);
            }
        };

        Request.prototype.onError = function (e) {
            illa.Log.error(this.name, this.getTypeName(), this.getIDBRequestID(e.target), e.message);
        };

        Request.prototype.onSuccess = function (e) {
            illa.Log.infoIf(this.name, this.getTypeName(), this.getIDBRequestID(e.target), 'Successful.');
        };

        Request.prototype.getIDBRequestID = function (request) {
            return illa.ArrayUtil.indexOf(this.requests, request);
        };

        Request.prototype.getObjectStoreDescriptor = function () {
            return this.objectStoreDescriptor;
        };
        Request.prototype.setName = function (value) {
            this.name = value;
            return this;
        };
        Request.prototype.getName = function () {
            return this.name;
        };
        Request.prototype.getRequests = function () {
            return this.requests;
        };
        Request.prototype.getRequest = function (id) {
            return this.requests[id];
        };
        Request.EVENT_SUCCESS = 'idb_Request_EVENT_SUCCESS';
        return Request;
    })(illa.EventHandler);
    adat.Request = Request;
})(adat || (adat = {}));
var adat;
(function (adat) {
    var Transaction = (function (_super) {
        __extends(Transaction, _super);
        function Transaction(database, requests) {
            _super.call(this);
            this.database = database;
            this.requests = requests;
            this.name = '';
        }
        Transaction.prototype.process = function () {
            if (this.database.getIsOpen()) {
                this.processInternal();
            } else {
                this.database.open();
                this.database.addEventCallback(adat.Database.EVENT_OPEN_SUCCESS, this.processInternal, this);
            }
            return this;
        };

        Transaction.prototype.processInternal = function () {
            this.transaction = this.database.getIDBDatabase().transaction(this.getObjectStoreNames(), Transaction.getModeValue(this.getMode()));
            this.transaction.onabort = illa.bind(this.onAbort, this);
            this.transaction.onerror = illa.bind(this.onError, this);
            this.transaction.oncomplete = illa.bind(this.onComplete, this);

            for (var i = 0, n = this.requests.length; i < n; i++) {
                var request = this.requests[i];
                var objectStoreName = this.database.getCurrentVersionDescriptor().getObjectStoreName(request.getObjectStoreDescriptor());
                request.process(this.transaction.objectStore(objectStoreName));
            }
        };

        Transaction.prototype.getObjectStoreNames = function () {
            var result = [];
            var osds = [];

            for (var i = 0, n = this.requests.length; i < n; i++) {
                var osd = this.requests[i].getObjectStoreDescriptor();
                if (illa.ArrayUtil.indexOf(osds, osd) == -1) {
                    osds.push(osd);
                    result.push(this.database.getCurrentVersionDescriptor().getObjectStoreName(osd));
                }
            }

            return result;
        };

        Transaction.prototype.getMode = function () {
            var result = 0 /* READONLY */;
            for (var i = 0, n = this.requests.length; i < n; i++) {
                var mode = this.requests[i].getMode();
                if (mode > result) {
                    result = mode;
                    break;
                }
            }
            return result;
        };

        Transaction.getModeValue = function (mode) {
            switch (mode) {
                case 0 /* READONLY */:
                    return 'readonly';
                case 1 /* READWRITE */:
                    return 'readwrite';
            }
            return '';
        };

        Transaction.prototype.onAbort = function (e) {
            illa.Log.warn('Aborted transaction.');

            new illa.Event(Transaction.EVENT_ABORT, this).dispatch();
        };

        Transaction.prototype.onError = function (e) {
            illa.Log.error('Transaction error:', e.message);

            new illa.Event(Transaction.EVENT_ERROR, this).dispatch();
        };

        Transaction.prototype.onComplete = function (e) {
            illa.Log.infoIf(this.name, 'Transaction complete.');

            new illa.Event(Transaction.EVENT_COMPLETE, this).dispatch();
        };

        Transaction.prototype.getDatabase = function () {
            return this.database;
        };
        Transaction.prototype.getRequests = function () {
            return this.requests;
        };
        Transaction.prototype.getIDBTransaction = function () {
            return this.transaction;
        };
        Transaction.prototype.setName = function (value) {
            this.name = value;
            return this;
        };
        Transaction.prototype.getName = function () {
            return this.name;
        };
        Transaction.EVENT_ABORT = 'idb_Transaction_EVENT_ABORT';
        Transaction.EVENT_ERROR = 'idb_Transaction_EVENT_ERROR';
        Transaction.EVENT_COMPLETE = 'idb_Transaction_EVENT_COMPLETE';
        return Transaction;
    })(illa.EventHandler);
    adat.Transaction = Transaction;
})(adat || (adat = {}));
var adat;
(function (adat) {
    var RequestAdd = (function (_super) {
        __extends(RequestAdd, _super);
        function RequestAdd(objectStoreDescriptor, value, key) {
            _super.call(this, objectStoreDescriptor);
            this.value = value;
            this.key = key;
        }
        RequestAdd.prototype.processInternal = function (objectStore) {
            return [objectStore.add(this.value, this.key)];
        };

        RequestAdd.prototype.getTypeName = function () {
            return 'Add';
        };
        RequestAdd.prototype.getMode = function () {
            return 1 /* READWRITE */;
        };
        return RequestAdd;
    })(adat.Request);
    adat.RequestAdd = RequestAdd;
})(adat || (adat = {}));
var adat;
(function (adat) {
    (function (CursorDirection) {
        CursorDirection[CursorDirection["NEXT"] = 0] = "NEXT";
        CursorDirection[CursorDirection["PREV"] = 1] = "PREV";
        CursorDirection[CursorDirection["NEXTUNIQUE"] = 2] = "NEXTUNIQUE";
        CursorDirection[CursorDirection["PREVUNIQUE"] = 3] = "PREVUNIQUE";
    })(adat.CursorDirection || (adat.CursorDirection = {}));
    var CursorDirection = adat.CursorDirection;
})(adat || (adat = {}));
var adat;
(function (adat) {
    var RequestCursor = (function (_super) {
        __extends(RequestCursor, _super);
        function RequestCursor(objectStoreDescriptor, onResult, range, direction) {
            if (typeof direction === "undefined") { direction = 0 /* NEXT */; }
            _super.call(this, objectStoreDescriptor);
            this.onResult = onResult;
            this.range = range;
            this.direction = direction;
            this.result = [];
        }
        RequestCursor.prototype.processInternal = function (objectStore) {
            return [objectStore.openCursor(this.range, adat.CursorDirection[this.direction].toLowerCase())];
        };

        RequestCursor.prototype.onSuccess = function (e) {
            var cursor = this.getRequest(0).result;
            if (cursor) {
                this.result.push(cursor.value);
                cursor.continue();
            } else {
                _super.prototype.onSuccess.call(this, e);
                this.onResult(this.result);
            }
        };

        RequestCursor.prototype.getTypeName = function () {
            return 'Cursor';
        };
        RequestCursor.prototype.getMode = function () {
            return 0 /* READONLY */;
        };
        return RequestCursor;
    })(adat.Request);
    adat.RequestCursor = RequestCursor;
})(adat || (adat = {}));
var test1;
(function (test1) {
    var SomeValue = (function () {
        function SomeValue() {
            this.time = new Date().getTime();
            this.timeString = new Date().toUTCString();
        }
        return SomeValue;
    })();
    test1.SomeValue = SomeValue;
})(test1 || (test1 = {}));
var test1;
(function (test1) {
    var jquery = berek.jquery;

    var Main = (function () {
        function Main() {
            jquery.$(illa.bind(this.onDOMLoaded, this));
        }
        Main.prototype.onDOMLoaded = function () {
            if (adat.Database.isSupported()) {
                this.db = new adat.Database('adat-test', [
                    new adat.VersionDescriptor({
                        someValues: this.someValues = new adat.ObjectStoreDescriptor('id', true, {
                            time: this.someValuesTimeIndex = new adat.IndexDescriptor('time', true)
                        })
                    })
                ]);

                var addValues = new adat.Transaction(this.db, [
                    new adat.RequestAdd(this.someValues, new test1.SomeValue()).setName('addAValue'),
                    new adat.RequestCursor(this.someValues, illa.bind(this.onSomeValuesRetrieved, this), illa.GLOBAL.IDBKeyRange.bound(3, 5)).setName('readAllValues')
                ]).setName('addValues').process();
            }
        };

        Main.prototype.onSomeValuesRetrieved = function (values) {
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                illa.Log.info('Value', 'id:', value.id, 'time:', value.time, 'timeString:', value.timeString);
            }
        };
        Main.instance = new Main();
        return Main;
    })();
    test1.Main = Main;
})(test1 || (test1 = {}));
