import dynamic from 'next/dynamic';

export const DeleteModal = dynamic(() => import('@/components/modal/deleteModal'), { ssr: false });
export const AdminManagementCreateEditModal = dynamic(() => import('@/components/modal/adminManagementCreateEditModal'), { ssr: false });
export const EmailSettings = dynamic(() => import('@/components/modal/emailSettings'), { ssr: false });
export const AdminManagementDetailModal = dynamic(() => import('@/components/modal/adminManagementDetailModal'), { ssr: false });
export const AdminManagementDeleteModal = dynamic(() => import('@/components/modal/adminManagementDeleteModal'), { ssr: false });
export const AdminManagementImportModal = dynamic(() => import('@/components/modal/adminManagementImportModal'), { ssr: false });
export const StaffManagementDetailModal = dynamic(() => import('@/components/modal/staffManagementDetailModal'), { ssr: false });
export const StaffManagementEditModal = dynamic(() => import('@/components/modal/StaffManagementEditModal'), { ssr: false });
export const CommonDialog = dynamic(() => import('@/components/modal/commonDialog'), { ssr: false });
export const ExternalModal = dynamic(() => import('@/components/modal/externalModal'), { ssr: false });
export const HqEditModal = dynamic(() => import('@/components/modal/headquartersManagementEditModal'), { ssr: false });
export const HqManagementDetailModal = dynamic(() => import('@/components/modal/hqManagementDetailModal'), { ssr: false });
export const PlaceEventBulkCheckOut = dynamic(() => import('@/components/modal/placeEventBulkCheckOut'), { ssr: false });
export const QrScannerModal = dynamic(() => import('@/components/modal/qrScannerModal'), { ssr: false });
export const DepartmentCreateEditModal = dynamic(() => import('@/components/modal/departmentManagementCreateEditModal'), { ssr: false });