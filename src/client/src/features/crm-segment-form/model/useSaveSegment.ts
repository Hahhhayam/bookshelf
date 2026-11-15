import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { referenceApi, useRefreshReference } from '@/entities/reference'

export interface SegmentValues {
  name: string
  description: string
}

const toArgs = (values: SegmentValues) => [values.name.trim(), values.description.trim() || null] as const

/** Creates a segment (id absent) or updates one; the list is remembered locally until the API lists it (GAP-12). */
export function useSaveSegment(id?: string) {
  const refresh = useRefreshReference()
  return useMutation({
    mutationFn: async (values: SegmentValues) => {
      if (id) await referenceApi.updateSegment(id, ...toArgs(values))
      else await referenceApi.createSegment(...toArgs(values))
    },
    onSuccess: async (_none, values) => {
      await refresh('segments')
      notifications.show({ color: 'green', message: id ? 'Сегмент збережено' : `Сегмент «${values.name.trim()}» створено` })
    },
  })
}
