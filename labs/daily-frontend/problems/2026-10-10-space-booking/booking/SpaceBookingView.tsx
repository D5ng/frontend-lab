import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { Badge, Callout, Checkbox, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem, ListRadioItem } from 'seed-design/ui/list'
import { RadioGroup, Radiomark } from 'seed-design/ui/radio-group'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { BookingDraft, Quote, Space } from './types'
export interface SpaceBookingViewProps {
  draft: BookingDraft
  spaces: Space[]
  quote: Quote | null
  loading: boolean
  reserving: boolean
  error: string
  success: string
  starter?: boolean
  preview?: boolean
  onChange: (patch: Partial<BookingDraft>) => void
  onReload: () => void
  onReserve: () => void
}
export function SpaceBookingView(props: SpaceBookingViewProps) {
  const { draft, spaces, quote, loading, reserving } = props
  const disabled = loading || reserving
  return (
    <VStack as="article" aria-label="모임 공간 예약" width="full" gap="x6" py="x6">
      <VStack as="header" px="x5" gap="x3">
        <Badge variant="weak" tone="brand" size="medium">
          우리의 모임 공간
        </Badge>
        <Text as="h2" textStyle="t8Bold">
          모일 시간에 맞는,
          <br />
          편안한 자리
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          인원과 시간을 먼저 정하고
          <br />
          조건에 맞는 공간을 비교해요.
        </Text>
        {(props.starter || props.preview) && (
          <Callout.Root tone="neutral">
            <Callout.Content>
              <Callout.Description>
                {props.preview
                  ? 'UI 미리보기 · 고정 데이터예요. 조회·견적·예약은 아직 연결하지 않았어요.'
                  : '미연결 스타터예요. 공간 조회·조건 판단·견적·예약을 직접 구현해 주세요.'}
              </Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
      </VStack>
      <VStack
        as="form"
        gap="x6"
        width="full"
        onSubmit={(event) => {
          event.preventDefault()
          props.onReserve()
        }}
      >
        <VStack px="x5" gap="x4">
          <SelectRoot
            label="이용 날짜"
            value={[draft.day]}
            disabled={disabled}
            onValueChange={(values) => {
              if (values[0] === 'today' || values[0] === 'tomorrow') props.onChange({ day: values[0] })
            }}
          >
            <SelectTrigger />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today" label="오늘" />
                <SelectItem value="tomorrow" label="내일" />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
          <HStack gap="x3" align="flex-start">
            <VStack width="full">
              <SelectRoot
                label="시작 시각"
                value={[draft.start]}
                disabled={disabled}
                onValueChange={(values) => {
                  if (values[0]) props.onChange({ start: values[0] })
                }}
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectGroup>
                    {['09', '10', '13', '16'].map((hour) => (
                      <SelectItem key={hour} value={hour} label={hour + ':00'} />
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            </VStack>
            <VStack width="full">
              <SelectRoot
                label="이용 시간"
                value={[draft.duration]}
                disabled={disabled}
                onValueChange={(values) => {
                  if (values[0]) props.onChange({ duration: values[0] })
                }}
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectGroup>
                    {['1', '2', '3'].map((hour) => (
                      <SelectItem key={hour} value={hour} label={hour + '시간'} />
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            </VStack>
          </HStack>
          <TextField
            label="모임 인원"
            value={draft.guests}
            suffix="명"
            disabled={disabled}
            onValueChange={({ value }) => props.onChange({ guests: value })}
          >
            <TextFieldInput inputMode="numeric" />
          </TextField>
        </VStack>
        <List as="div">
          <ListCheckItem
            title="프로젝터가 필요해요"
            detail="이용료에 3,000원이 한 번 추가돼요."
            checked={draft.projector}
            disabled={disabled}
            onCheckedChange={(checked) => props.onChange({ projector: checked })}
            inputProps={{ 'aria-label': '프로젝터 추가' }}
            suffix={
              <Checkbox.Control size="large">
                <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
              </Checkbox.Control>
            }
          />
        </List>
        <VStack gap="x3" width="full">
          <VStack px="x5" gap="x1">
            <Text as="h3" textStyle="t5Bold">
              예약할 수 있는 공간
            </Text>
            <Text textStyle="t3Regular" color="fg.neutralSubtle">
              전 시간 이용 가능하고 인원과 장비 조건이 맞는 공간만 보여요.
            </Text>
          </VStack>
          {loading ? (
            <VStack px="x5" role="status" aria-label="공간 조회 중">
              <Skeleton width="full" height="x12" />
            </VStack>
          ) : !spaces.length ? (
            <VStack px="x5" gap="x3">
              <Text textStyle="t4Regular">조건에 맞는 공간이 없어요.</Text>
              <ActionButton type="button" variant="neutralWeak" disabled={reserving} onClick={props.onReload}>
                공간 다시 불러오기
              </ActionButton>
            </VStack>
          ) : (
            <RadioGroup
              label="공간 선택"
              value={draft.spaceId}
              disabled={reserving}
              onValueChange={(value) => props.onChange({ spaceId: value })}
            >
              <List as="div">
                {spaces.map((space) => (
                  <ListRadioItem
                    key={space.id}
                    value={space.id}
                    title={space.name}
                    detail={space.capacity + '명까지 · 시간당 ' + space.hourlyPrice.toLocaleString('ko-KR') + '원'}
                    inputProps={{ 'aria-label': space.name }}
                    suffix={<Radiomark size="large" />}
                  />
                ))}
              </List>
            </RadioGroup>
          )}
        </VStack>
        <VStack px="x5" gap="x4">
          <VStack as="section" aria-label="예약 견적" p="x5" bg="bg.neutralWeak" borderRadius="r4" gap="x3">
            <Text as="h3" textStyle="t5Bold">
              예약 전에 확인해요
            </Text>
            {quote ? (
              <>
                <Text textStyle="t4Bold">{quote.spaceName}</Text>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  {quote.timeLabel}
                </Text>
                <HStack justify="space-between">
                  <Text textStyle="t4Regular">공간 이용료</Text>
                  <Text textStyle="t4Regular">{quote.base.toLocaleString('ko-KR')}원</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text textStyle="t4Regular">장비 추가</Text>
                  <Text textStyle="t4Regular">{quote.equipment.toLocaleString('ko-KR')}원</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text textStyle="t4Bold">합계</Text>
                  <Text textStyle="t5Bold">{quote.total.toLocaleString('ko-KR')}원</Text>
                </HStack>
              </>
            ) : (
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                공간을 고르면 이용료를 확인할 수 있어요.
              </Text>
            )}
          </VStack>
          {props.error && (
            <Callout.Root tone="critical" role="alert">
              <Callout.Content>
                <Callout.Description>{props.error}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
          {props.success && (
            <Callout.Root tone="positive" role="status">
              <Callout.Content>
                <Callout.Description>{props.success}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
          <ActionButton
            type="submit"
            variant="brandSolid"
            size="large"
            aria-label={reserving ? '공간 예약 중' : '공간 예약하기'}
            loading={reserving}
            disabled={!quote || disabled || !!props.success}
          >
            {reserving ? '공간 예약 중' : '공간 예약하기'}
          </ActionButton>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            실습용 공간이에요. 실제 예약·결제는 하지 않아요.
          </Text>
        </VStack>
      </VStack>
    </VStack>
  )
}
