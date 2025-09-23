import { 
  exportToExcel, 
  exportBookingsToExcel, 
  exportPackagesToExcel, 
  exportDestinationsToExcel, 
  exportUsersToExcel 
} from '~/utils/excelExport'

export const useExcelExport = () => {
  return {
    exportToExcel,
    exportBookingsToExcel,
    exportPackagesToExcel,
    exportDestinationsToExcel,
    exportUsersToExcel
  }
}
