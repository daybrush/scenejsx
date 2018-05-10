# ObserverX
* rx.js의 Observable 따라해봤습니다.
---

## Observable
```js
interface Observer {
  next(value) => void;
  complete() => void;
}
```
---
## fromEvent
* 이벤트 가져오기
```js
const $item = item.fromEvent("animate");
```
---

## takeUntil
* 언제까지 이벤트를 진행할건지 ended이벤트가 불리면 더 이상 animate이벤트를 진행하지 않는다.
```js
item.fromEvent("animate")
	.takeUntil(item.fromEvent("ended"))
```

---
## deduplicate
* 중복은 진행하지 않는다.
```js
item.fromEvent("animate")
	.takeUntil(item.fromEvent("ended"))
	.deduplicate(({currentTime}) =>     	
	parseInt(currentTime / dist))
```

--- 
## map
* 넘어오는 값을 바꿀 수 있다.
```js
item.fromEvent("animate")
	.takeUntil(item.fromEvent("ended"))
	.deduplicate(({currentTime}) =>     	
	parseInt(currentTime / dist))
	.map(e => e.frame)
```

---
## each
* 넘어오는 값마다 함수를 실행한다.
```js
item.fromEvent("animate")
	.takeUntil(item.fromEvent("ended"))
	.deduplicate(({currentTime}) =>     	
	parseInt(currentTime / dist))
	.map(e => e.frame)
	.each(frame => element.style.cssText +=
    	frame.toCSS());
```


---

## stopMotion 만들기
```js
function stopMotion(item, dist, element) {
    item.fromEvent("animate")
        .takeUntil(item.fromEvent("ended"))
        .deduplicate(({currentTime}) => 
        parseInt(currentTime / dist))
        .map(e => e.frame)
        .each(frame => element.style.cssText +=
        frame.toCSS());
    item.play();
}
stopMotion(scene.getItem(".d"), 1, 
	document.querySelector(".character2.d"));
```
