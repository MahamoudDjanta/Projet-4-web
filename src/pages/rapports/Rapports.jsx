import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, Search } from 'lucide-react'
import { previewRapport } from '../../api/rapports'
import ReportPreview from '../../components/pdf/ReportPreview'
import { Button, Card, Input } from '../../components/ui'

export default function Rapports() {
  const [filters, setFilters] = useState({ classe_id: '', date_debut: '', date_fin: '', cours_id: '' })
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function preview(event) {
    event.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await previewRapport(filters)
      setReport(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function download() {
    const node = document.getElementById('report-preview')
    const canvas = await html2canvas(node, { scale: 2 })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height)
    pdf.save('rapport-presence.pdf')
  }

  return (
    <div className="grid gap-6">
      <Card>
        <form className="grid gap-4 md:grid-cols-4" onSubmit={preview}>
          <Input label="Classe" value={filters.classe_id} onChange={(event) => setFilters({ ...filters, classe_id: event.target.value })} required />
          <Input label="Date debut" type="date" value={filters.date_debut} onChange={(event) => setFilters({ ...filters, date_debut: event.target.value })} required />
          <Input label="Date fin" type="date" value={filters.date_fin} onChange={(event) => setFilters({ ...filters, date_fin: event.target.value })} required />
          <Input label="Cours" value={filters.cours_id} onChange={(event) => setFilters({ ...filters, cours_id: event.target.value })} />
          <div className="flex gap-2 md:col-span-4">
            <Button type="submit"><Search className="h-4 w-4" /> Apercu</Button>
            <Button variant="secondary" onClick={download} disabled={!report}><Download className="h-4 w-4" /> Telecharger PDF</Button>
          </div>
        </form>
      </Card>
      <ReportPreview report={report} isLoading={isLoading} />
    </div>
  )
}
