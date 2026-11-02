import { useState } from 'react'
import type { SavingsTerm } from '../api'
import { getInitialMonths } from '../savings'

export function useSelectedTerm(terms: SavingsTerm[]) {
  const [selectedMonths, setSelectedMonths] = useState(getInitialMonths(terms))

  // NOTE: selectedMonths는 초기값과 변경될 값들이 terms를 기준으로 변경되어 항상 값이 있다는것을 보장한다.
  const selectedTerm = terms.find((term) => term.months === selectedMonths) as SavingsTerm

  const selectMonths = (value: number) => setSelectedMonths(value)

  return {
    selectedMonths,
    selectedTerm,
    selectMonths,
  }
}
