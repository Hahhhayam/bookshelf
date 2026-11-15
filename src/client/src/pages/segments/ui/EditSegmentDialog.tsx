import { Modal } from '@mantine/core'
import type { Segment } from '@/entities/reference'
import { SegmentForm, useSaveSegment } from '@/features/crm-segment-form'

export function EditSegmentDialog({ segment, onClose }: { segment: Segment; onClose: () => void }) {
  const save = useSaveSegment(segment.id)
  return (
    <Modal opened onClose={onClose} title="Редагувати сегмент" centered>
      <SegmentForm defaultValues={{ name: segment.name, description: segment.description ?? '' }} submitLabel="Зберегти"
        submitting={save.isPending} error={save.error ?? undefined} onCancel={onClose}
        onSubmit={(values) => save.mutateAsync(values).then(onClose)} />
    </Modal>
  )
}
