import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconDownload } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { reportApi, type ReportFilter } from '@/entities/report'
import { errorMessage } from '@/shared/ui'
import { downloadBlob } from '../lib/downloadBlob'

const day = (iso: string) => iso.slice(0, 10).replaceAll('-', '')

/** Downloads the same management report as a CSV file. */
export function ExportCsvButton({ filter, disabled }: { filter: ReportFilter; disabled?: boolean }) {
  const exportCsv = useMutation({
    mutationFn: () => reportApi.csv(filter),
    onSuccess: (blob) => downloadBlob(blob, `management-report-${day(filter.from)}-${day(filter.to)}.csv`),
    onError: (error) => notifications.show({ color: 'red', title: 'Експорт не вдався', message: errorMessage(error) }),
  })
  return (
    <Button
      variant="default" leftSection={<IconDownload size={18} stroke={1.75} />} loading={exportCsv.isPending}
      disabled={disabled} onClick={() => exportCsv.mutate()}
    >
      Експорт CSV
    </Button>
  )
}
