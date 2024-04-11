"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroOrmEntitiesStorage = void 0;
class MikroOrmEntitiesStorage {
    static addEntity(entity, contextName = 'default') {
        if (this.shouldClear) {
            this.clear(contextName);
            this.shouldClear = false;
        }
        let set = this.storage.get(contextName);
        if (!set) {
            set = new Set();
            this.storage.set(contextName, set);
        }
        set.add(entity);
    }
    static getEntities(contextName = 'default') {
        return this.storage.get(contextName)?.values() || [];
    }
    static clear(contextName = 'default') {
        this.storage.get(contextName)?.clear();
    }
    /**
     * When the `addEntity` is called next, the storage will be cleared automatically before it.
     * We want to keep the cache, as it's populated on require time, but sometimes (tests) the contexts could be cleared.
     * This resolves both cases by deferring the `clear` call to the first `addEntity` call.
     */
    static clearLater() {
        this.shouldClear = true;
    }
}
exports.MikroOrmEntitiesStorage = MikroOrmEntitiesStorage;
MikroOrmEntitiesStorage.storage = new Map();
MikroOrmEntitiesStorage.shouldClear = false;
