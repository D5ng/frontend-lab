import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, Callout, Checkbox, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { useEffect, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { Place, TripApi } from '../trip/types'
import '../trip/style.css'

export function DayTripPage({ api }: { api: TripApi }) {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [start, setStart] = useState('10')
  const [budget, setBudget] = useState('15000')
  const [ids, setIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const [saved, setSaved] = useState('')
  useEffect(() => {
    let cancelled = false
    api.getPlaces().then(
      (value) => {
        if (!cancelled) {
          setPlaces(value)
          setLoading(false)
        }
      },
      () => {
        if (!cancelled) {
          setLoadError(true)
          setLoading(false)
        }
      },
    )
    return () => {
      cancelled = true
    }
  }, [api])
  async function reload() {
    if (loading) return
    setLoadError(false)
    setLoading(true)
    try {
      setPlaces(await api.getPlaces())
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }
  const timeline = ids.map((id, index) => {
    const place = places.find((item) => item.id === id)!
    const arrival =
      Number(start) * 60 +
      ids.slice(0, index).reduce((minutes, previous) => minutes + places.find((item) => item.id === previous)!.duration, 0) +
      index * 15
    const end = arrival + place.duration
    return { ...place, arrival, end, valid: arrival >= place.opens * 60 && end <= place.closes * 60 }
  })
  const total = timeline.reduce((sum, place) => sum + place.fee, 0)
  const validBudget = /^\d+$/.test(budget) && Number.isSafeInteger(Number(budget)) && Number(budget) >= 0 && Number(budget) <= 1000000
  const over = validBudget && total > Number(budget)
  const conflict = timeline.some((place) => !place.valid)
  const disabled = loading || loadError || saving || !ids.length || !validBudget || over || conflict
  const time = (minutes: number) => String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0')
  async function save() {
    if (disabled) return
    setSaving(true)
    setMessage('')
    setFailed(false)
    try {
      await api.save({ startHour: Number(start), budget: Number(budget), placeIds: [...ids] })
      setSaved(
        timeline.map((place) => place.name + ' ' + time(place.arrival) + '–' + time(place.end)).join(' → ') +
          ' · ' +
          total.toLocaleString('ko-KR') +
          '원',
      )
      setMessage('여행 일정을 저장했어요.')
    } catch {
      setFailed(true)
      setMessage('일정을 저장하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setSaving(false)
    }
  }
  return (
    <VStack as="article" className="day-trip" aria-label="하루 여행 계획" py="x6" gap="x6" width="full">
      <VStack as="header" px="x5" gap="x3">
        <Badge variant="weak" tone="brand" size="medium">
          하루 여행
        </Badge>
        <Text as="h2" textStyle="t8Bold">
          가고 싶은 곳을,
          <br />갈 수 있는 일정으로
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          방문 순서와 머무는 시간을 보고
          <br />
          하루의 여유를 계획해요.
        </Text>
      </VStack>
      <VStack
        as="form"
        width="full"
        gap="x6"
        onSubmit={(event) => {
          event.preventDefault()
          void save()
        }}
      >
        <VStack px="x5" gap="x4">
          <SelectRoot
            label="출발 시각"
            value={[start]}
            disabled={loading || loadError || saving}
            onValueChange={(values) => {
              if (values[0]) {
                setStart(values[0])
                setMessage('')
              }
            }}
          >
            <SelectTrigger />
            <SelectContent>
              <SelectGroup>
                {['09', '10', '13', '17'].map((hour) => (
                  <SelectItem key={hour} value={hour} label={hour + ':00'} />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
          <TextField
            label="입장료 예산"
            value={budget}
            suffix="원"
            disabled={loading || loadError || saving}
            invalid={!validBudget}
            errorMessage="0~1,000,000 사이의 정수로 입력해 주세요."
            onValueChange={({ value }) => {
              setBudget(value)
              setMessage('')
            }}
          >
            <TextFieldInput inputMode="numeric" />
          </TextField>
        </VStack>
        <VStack width="full" gap="x3">
          <VStack px="x5" gap="x1">
            <Text as="h3" textStyle="t5Bold">
              어디를 들를까요?
            </Text>
            <Text textStyle="t3Regular" color="fg.neutralSubtle">
              고른 순서로 방문해요. 장소 사이 이동은 15분이에요.
            </Text>
          </VStack>
          {loading ? (
            <VStack px="x5" role="status" aria-label="장소 조회 중">
              <Skeleton width="full" height="x12" />
            </VStack>
          ) : loadError ? (
            <VStack px="x5" gap="x3">
              <Callout.Root tone="critical" role="alert">
                <Callout.Content>
                  <Callout.Description>장소를 불러오지 못했어요. 다시 시도해 주세요.</Callout.Description>
                </Callout.Content>
              </Callout.Root>
              <ActionButton type="button" variant="neutralWeak" onClick={() => void reload()}>
                장소 다시 불러오기
              </ActionButton>
            </VStack>
          ) : !places.length ? (
            <Box px="x5">
              <Text textStyle="t4Regular">오늘 추천 장소가 없어요.</Text>
            </Box>
          ) : (
            <List as="div" aria-label="추천 장소">
              {places.map((place) => (
                <ListCheckItem
                  key={place.id}
                  title={place.name}
                  detail={
                    place.duration + '분 · ' + place.fee.toLocaleString('ko-KR') + '원 · ' + place.opens + '시~' + place.closes + '시'
                  }
                  checked={ids.includes(place.id)}
                  disabled={saving}
                  inputProps={{ 'aria-label': place.name + ' 방문' }}
                  onCheckedChange={(checked) => {
                    setIds((current) => (checked ? [...current, place.id] : current.filter((id) => id !== place.id)))
                    setMessage('')
                  }}
                  suffix={
                    <Checkbox.Control size="large">
                      <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
                    </Checkbox.Control>
                  }
                />
              ))}
            </List>
          )}
        </VStack>
        <VStack px="x5" gap="x4">
          <VStack as="section" aria-label="여행 일정 요약" bg="bg.neutralWeak" borderRadius="r4" p="x5" gap="x4">
            <Text as="h3" textStyle="t5Bold">
              이 순서로 다녀와요
            </Text>
            {!timeline.length ? (
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                가고 싶은 장소를 골라 주세요.
              </Text>
            ) : (
              timeline.map((place, index) => (
                <VStack key={place.id} gap="x2">
                  <HStack justify="space-between" align="center" gap="x2">
                    <Text textStyle="t4Bold">{index + 1 + '. ' + place.name}</Text>
                    {index > 0 && (
                      <ActionButton
                        type="button"
                        variant="neutralWeak"
                        size="large"
                        disabled={saving}
                        aria-label={place.name + ' 앞으로'}
                        onClick={() => {
                          setIds((current) => {
                            const next = [...current]
                            ;[next[index - 1], next[index]] = [next[index]!, next[index - 1]!]
                            return next
                          })
                          setMessage('')
                        }}
                      >
                        앞으로
                      </ActionButton>
                    )}
                  </HStack>
                  <Text textStyle="t3Regular" color={place.valid ? 'fg.neutralSubtle' : 'fg.critical'}>
                    {time(place.arrival) + '–' + time(place.end) + (place.valid ? '' : ' · 운영 시간에 맞지 않아요')}
                  </Text>
                </VStack>
              ))
            )}
            <HStack justify="space-between">
              <Text textStyle="t4Regular">입장료 합계</Text>
              <Text textStyle="t5Bold">{total.toLocaleString('ko-KR')}원</Text>
            </HStack>
            {over && (
              <Text role="alert" textStyle="t3Regular" color="fg.critical">
                {(total - Number(budget)).toLocaleString('ko-KR')}원 예산을 초과했어요.
              </Text>
            )}
            {conflict && (
              <Text role="alert" textStyle="t3Regular" color="fg.critical">
                출발 시각이나 방문 순서를 바꿔 주세요.
              </Text>
            )}
          </VStack>
          {message && (
            <Callout.Root tone={failed ? 'critical' : 'positive'} role={failed ? 'alert' : 'status'}>
              <Callout.Content>
                <Callout.Description>{message}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
          <ActionButton
            type="submit"
            variant="brandSolid"
            size="large"
            aria-label={saving ? '일정 저장 중' : '여행 일정 저장하기'}
            loading={saving}
            disabled={disabled}
          >
            {saving ? '일정 저장 중' : '여행 일정 저장하기'}
          </ActionButton>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            실습용 장소와 운영 시간이에요. 실제 예약은 하지 않아요.
          </Text>
        </VStack>
      </VStack>
      {saved && (
        <VStack as="section" aria-label="마지막 저장 일정" px="x5" gap="x2">
          <Text as="h3" textStyle="t4Bold">
            마지막으로 저장한 일정
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            {saved}
          </Text>
        </VStack>
      )}
    </VStack>
  )
}
