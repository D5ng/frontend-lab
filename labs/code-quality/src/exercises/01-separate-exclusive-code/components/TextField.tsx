import { ComponentProps } from 'react'

type Props = ComponentProps<'input'>

export function TextField({ children, name, placeholder, value, onChange, ...restProps }: Props) {
  return (
    <label className="field">
      {children}
      <input name={name} placeholder={placeholder} value={value} onChange={onChange} {...restProps} />
    </label>
  )
}
