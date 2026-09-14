import { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & {
  onValueChange: (value: string) => void
}

export function RadioField({ children, name, checked, value, onValueChange, ...restProps }: Props) {
  return (
    <label>
      <input
        checked={checked}
        name={name}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        type="radio"
        {...restProps}
      />
      {children}
    </label>
  )
}
