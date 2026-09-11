import { FormEvent, useState } from "react";

type FulfillmentMethod = "delivery" | "pickup";

export function Problem() {
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>("delivery");
  const [address, setAddress] = useState("");
  const [pickupStore, setPickupStore] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (fulfillmentMethod === "delivery") {
      if (address.trim().length === 0) {
        setResultMessage("배달 주소를 입력해 주세요.");
        return;
      }

      setResultMessage(`${address.trim()} 주소로 배달을 요청했어요.`);
      return;
    }

    if (pickupStore.trim().length === 0) {
      setResultMessage("픽업 매장을 입력해 주세요.");
      return;
    }

    setResultMessage(`${pickupStore.trim()} 매장에서 픽업을 요청했어요.`);
  }

  return (
    <section className="exercise-card" aria-labelledby="request-title">
      <div className="exercise-copy">
        <p className="step-label">Starter code</p>
        <h2 id="request-title">상품 수령 방법</h2>
        <p>
          현재 컴포넌트는 배달과 픽업의 입력, 검증, 결과 생성을 모두 알고
          있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>수령 방법을 선택해 주세요.</legend>

          <label>
            <input
              checked={fulfillmentMethod === "delivery"}
              name="fulfillmentMethod"
              onChange={() => {
                setFulfillmentMethod("delivery");
                setResultMessage("");
              }}
              type="radio"
              value="delivery"
            />
            배달
          </label>

          <label>
            <input
              checked={fulfillmentMethod === "pickup"}
              name="fulfillmentMethod"
              onChange={() => {
                setFulfillmentMethod("pickup");
                setResultMessage("");
              }}
              type="radio"
              value="pickup"
            />
            매장 픽업
          </label>
        </fieldset>

        {fulfillmentMethod === "delivery" ? (
          <label className="field">
            배달 주소
            <input
              name="address"
              onChange={(event) => setAddress(event.target.value)}
              placeholder="예: 서울시 강남구 테헤란로 1"
              value={address}
            />
          </label>
        ) : (
          <label className="field">
            픽업 매장
            <input
              name="pickupStore"
              onChange={(event) => setPickupStore(event.target.value)}
              placeholder="예: 역삼점"
              value={pickupStore}
            />
          </label>
        )}

        <button type="submit">요청하기</button>
      </form>

      <p aria-live="polite" className="result-message">
        {resultMessage}
      </p>
    </section>
  );
}
