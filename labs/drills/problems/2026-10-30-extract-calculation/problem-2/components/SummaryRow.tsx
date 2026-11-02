import { HStack, Text, VStack } from '@seed-design/react'

interface Props {
  label: string
  value: string
  description?: string
  isTotal?: boolean
}

export function SummaryRow({ label, value, description, isTotal = false }: Props) {
  return (
    <HStack justifyContent="space-between">
      <Text textStyle={isTotal ? 't5Bold' : undefined} color={isTotal ? undefined : 'fg.neutralSubtle'}>
        {label}
      </Text>
      {description ? (
        <VStack alignItems="flex-end" gap="x0_5">
          <Text>{value}</Text>
          <Text textStyle="t3Regular" color="fg.brand">
            {description}
          </Text>
        </VStack>
      ) : (
        <Text textStyle={isTotal ? 't5Bold' : undefined}>{value}</Text>
      )}
    </HStack>
  )
}
