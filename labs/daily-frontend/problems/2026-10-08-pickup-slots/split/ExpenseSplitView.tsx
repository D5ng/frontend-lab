import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { Badge, Callout, Checkbox, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { Member, SplitDraft, SplitResult } from './types'
import './style.css'

export interface ExpenseSplitViewProps {
  draft: SplitDraft
  members: Member[]
  result: SplitResult | null
  loading: boolean
  saving: boolean
  error: string
  success: string
  starter?: boolean
  preview?: boolean
  onDraftChange: (patch: Partial<SplitDraft>) => void
  onToggle: (id: string) => void
  onWeightChange: (id: string, value: string) => void
  onCalculate: () => void
  onSave: () => void
  onReload: () => void
}
export function ExpenseSplitView(props: ExpenseSplitViewProps) {
  const { draft, members, result, loading, saving } = props
  return (
    <VStack as="article" className="expense-split" aria-label="공동 지출 정산" width="full" py="x6" gap="x6">
      <VStack px="x5" gap="x3">
        <Badge variant="weak" tone="brand" size="medium">
          함께 쓴 돈
        </Badge>
        <Text as="h2" textStyle="t8Bold">
          나누는 방법까지,
          <br />
          우리답게 정산해요
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          같이 쓴 금액과 참여자를 정하고
          <br />
          각자 부담할 금액을 확인해요.
        </Text>
        {(props.starter || props.preview) && (
          <Callout.Root tone="neutral">
            <Callout.Content>
              <Callout.Description>
                {props.preview
                  ? 'UI 미리보기 · 고정 데이터예요. 계산·저장 로직은 아직 연결하지 않았어요.'
                  : '미연결 스타터예요. 계산·조회·저장 로직을 직접 구현해 주세요.'}
              </Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
      </VStack>
      <VStack
        as="form"
        width="full"
        gap="x6"
        onSubmit={(event) => {
          event.preventDefault()
          props.onCalculate()
        }}
      >
        <VStack px="x5" gap="x4">
          <TextField
            label="지출 이름"
            value={draft.title}
            disabled={loading || saving}
            onValueChange={({ value }) => props.onDraftChange({ title: value })}
          >
            <TextFieldInput placeholder="예: 주말 모임 식비" />
          </TextField>
          <TextField
            label="함께 쓴 금액"
            value={draft.amount}
            suffix="원"
            disabled={loading || saving}
            onValueChange={({ value }) => props.onDraftChange({ amount: value })}
          >
            <TextFieldInput inputMode="numeric" placeholder="금액을 입력해 주세요" />
          </TextField>
          <RadioGroup
            label="나누는 방법"
            value={draft.method}
            disabled={loading || saving}
            onValueChange={(value) => {
              if (value === 'equal' || value === 'weighted') props.onDraftChange({ method: value })
            }}
          >
            <RadioGroupItem value="equal" label="똑같이 나누기" size="large" />
            <RadioGroupItem value="weighted" label="참여 횟수대로 나누기" size="large" />
          </RadioGroup>
        </VStack>
        <VStack gap="x3" width="full">
          <VStack px="x5" gap="x1">
            <Text as="h3" textStyle="t5Bold">
              함께한 사람
            </Text>
            <Text textStyle="t3Regular" color="fg.neutralSubtle">
              원 단위 차이도 합계에 맞춰 나눠요.
            </Text>
          </VStack>
          {loading ? (
            <VStack px="x5" role="status" aria-label="참여자 조회 중">
              <Skeleton width="full" height="x12" />
            </VStack>
          ) : members.length ? (
            <List as="div" aria-label="참여자">
              {members.map((member) => (
                <VStack key={member.id} width="full" gap="x2">
                  <ListCheckItem
                    title={member.name}
                    checked={draft.memberIds.includes(member.id)}
                    disabled={saving}
                    onCheckedChange={() => props.onToggle(member.id)}
                    inputProps={{ 'aria-label': member.name + ' 참여' }}
                    suffix={
                      <Checkbox.Control size="large">
                        <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
                      </Checkbox.Control>
                    }
                  />
                  {draft.method === 'weighted' && draft.memberIds.includes(member.id) && (
                    <VStack px="x5">
                      <TextField
                        label={member.name + ' 참여 횟수'}
                        value={draft.weights[member.id] || '1'}
                        disabled={saving}
                        onValueChange={({ value }) => props.onWeightChange(member.id, value)}
                      >
                        <TextFieldInput inputMode="numeric" />
                      </TextField>
                    </VStack>
                  )}
                </VStack>
              ))}
            </List>
          ) : (
            <VStack px="x5" gap="x3">
              <Text textStyle="t4Regular">참여자 목록이 아직 없어요.</Text>
              <ActionButton type="button" variant="neutralWeak" disabled={saving} onClick={props.onReload}>
                참여자 다시 불러오기
              </ActionButton>
            </VStack>
          )}
        </VStack>
        <VStack px="x5" gap="x4">
          <ActionButton type="submit" variant="neutralWeak" size="large" disabled={loading || saving}>
            부담 금액 계산하기
          </ActionButton>
          <VStack as="section" aria-label="정산 결과" bg="bg.neutralWeak" borderRadius="r4" p="x5" gap="x3">
            <Text as="h3" textStyle="t5Bold">
              각자 이만큼 부담해요
            </Text>
            {result ? (
              <>
                {result.shares.map((share) => (
                  <HStack key={share.memberId} justify="space-between">
                    <Text textStyle="t4Regular">{share.name}</Text>
                    <Text textStyle="t4Bold">{share.amount.toLocaleString('ko-KR')}원</Text>
                  </HStack>
                ))}
                <HStack justify="space-between">
                  <Text textStyle="t4Bold">합계</Text>
                  <Text textStyle="t5Bold">{result.total.toLocaleString('ko-KR')}원</Text>
                </HStack>
              </>
            ) : (
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                조건을 입력하고 부담 금액을 계산해 주세요.
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
            type="button"
            variant="brandSolid"
            size="large"
            aria-label={saving ? '정산안 저장 중' : '정산안 저장하기'}
            loading={saving}
            disabled={!result || loading || saving}
            onClick={props.onSave}
          >
            {saving ? '정산안 저장 중' : '정산안 저장하기'}
          </ActionButton>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            실습용 정산안이에요. 실제 송금은 하지 않아요.
          </Text>
        </VStack>
      </VStack>
    </VStack>
  )
}
