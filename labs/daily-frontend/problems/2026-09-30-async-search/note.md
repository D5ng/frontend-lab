# 풀이 기록

## 먼저 예상한 동작과 버그의 원인

1. 사용자 입력: `r`
2. 비동기 함수 실행
3. 사용자 입력: `re`
4. 비동기 함수 실행
5. 사용자 입력: `rea`

검색어: `r` => 비동기 함수 A
검색어: `re` => 비동기 함수 B
검색어: `rea` => 비동기 함수 C

비동기 함수가 A => B => C와 같이 완료 순서가 보장되지 않는다. 따라서 C -> B -> A와 같은 상황이 일어날 수 있다. 사용자가 입력한 검색어에 맞는 비동기 요청이 실행되어 나온 값으로 상태를 변경해야 사용자는 내가 입력한 검색어에 대한 정보를 확인할 수 있다.

즉 현재 입력된 검색어에 대한 요청의 값이 아닌, 이전의 요청 값이 상태를 덮어씌울 수 있다.

## 선택한 해결 방법과 이유

이 문제를 해결하기 위해서는 2가지 방법이 있다.

1. `ignore 또는 flag` 방식으로 클로저를 사용한 방식
2. `AbortController` 생성자 함수를 사용하여 요청 자체를 취소하는 방식

## 직접 확인한 순서와 결과

```tsx
useEffect(() => {
  // 클로저 방식
  let cancelled = false

  // 검색어가 없을 때 처리 방법
  if (!query) {
    setProducts([])
    setIsLoading(false)
    return
  }

  setIsLoading(true)

  searchProducts(query)
    .then((result) => {
      if (!cancelled) {
        setProducts(result)
      }
    })
    .finally(() => {
      // 이전 요청이 최신 요청의 로딩 상태를 변경하지 못하게 한다
      if (cancelled) {
        return
      }

      setIsLoading(false)
    })

  return () => {
    cancelled = true
  }
}, [query, searchProducts])
```

```tsx
useEffect(() => {
  if (!query) {
    setProducts([])
    setIsLoading(false)
    return
  }

  setIsLoading(true)

  const controller = new AbortController()

  searchProducts(query, { signal: controller.signal })
    .then((result) => {
      setProducts(result)
    })
    .catch((error) => {
      if (controller.signal.aborted) {
        return
      }

      throw error
    })
    .finally(() => {
      if (controller.signal.aborted) {
        return
      }

      setIsLoading(false)
    })

  return () => {
    controller.abort()
  }
}, [query, searchProducts])
```

## 풀이 후 바뀐 생각
