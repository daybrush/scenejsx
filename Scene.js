class ObserverX {
	constructor(func) {
		this.list = [];
		this.func = func;
		this.count = 0;
	}
	merge(observer) {
		observer.push(new ObserverX((value, index) => {
			this.next(value);
		}));
		return this;
	}
	go(value) {
		const returnValue = this.func(value, this.index);

		++this.count;
		returnValue.length && this.next(returnValue[0]);

		return this;
	}
	next(value) {
		this.list.forEach(x => x.go(value));

		return this;
	}
	complete() {
		this.list = [];
		this.count = 0;
	}
	push(observer) {
		this.list.push(observer);
		return observer;
	}
	each(func) {
		return this.push(new ObserverX((value, index) => {
			func(value, index);
			return [value];
		}));
	}
	map(func) {
		return this.push(new ObserverX((value, index) => [func(value, index)]));
	}
	filter(func) {
		return this.push(new ObserverX((value, index) => func(value, index) ? [value] : []));
	}
	scan(func, start) {
		return this.push(new ObserverX(function (value, index) {
			if ("start" in this) {
				const notIn = typeof start === "undefined";
				this.start = start;
			}
			this.start = func(this.start, value, index);

			return [this.start];
		}));
	}
	deduplicate(func) {
		return this.push(new ObserverX(function (value, index) {
			!this._deduplicate && (this._deduplicate = {});

			const key = func(value, index);
			const check = this._deduplicate[key];

			this._deduplicate[key] = true;
			return check ? [] : [value];
		}));
	}
	takeUntil(observer) {
		observer.push(new ObserverX((value, index) => {
			this.complete();

			return [value];
		}));
		return this;
	}
}
class EventObserver extends ObserverX{
	constructor(item, name) {
		super();
		this.item = item;
		this.name = name;
		this.trigger = this.trigger.bind(this);
		item.on(name, this.trigger);
	}
	trigger(e) {
		return this.next(e);
	}
	complete() {
		super.complete();
		this.item.off(this.name, this.trigger);
	}
}


Scene.prototype.fromEvent = function(name) {
	return new EventObserver(this, name);
}
Scene.SceneItem.prototype.fromEvent = function(name) {
	return new EventObserver(this, name);
}
