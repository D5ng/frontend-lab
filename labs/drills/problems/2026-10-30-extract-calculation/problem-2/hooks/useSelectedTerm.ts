import { useState } from 'react'
import type { SavingsTerm } from '../api'
import { getInitialMonths } from '../savings'

export function useSelectedTerm(terms: SavingsTerm[]) {
  const [selectedMonths, setSelectedMonths] = useState(getInitialMonths(terms))

  // NOTE: selectMonths는 terms에 있는 기간만 넘기기 때문에, 항상 찾는다.
  const selectedTerm = terms.find((term) => term.months === selectedMonths) as SavingsTerm

  const selectMonths = (months: number) => setSelectedMonths(months)

  return {
    selectedTerm,
    selectMonths,
  }
}
