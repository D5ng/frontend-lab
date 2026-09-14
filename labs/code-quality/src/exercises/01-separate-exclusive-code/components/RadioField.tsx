import { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & {
  onCheck: () => void
}

export function RadioField({ children, name, checked, value, onCheck, ...restProps }: Props) {
  return (
    <label>
      <input checked={checked} name={name} value={value} onChange={() => onCheck()} type="radio" {...restProps} />
      {children}
    </label>
  )
}
