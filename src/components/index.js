import dynamic from 'next/dynamic';

// Dynamic imports for large components
export const NormalTable = dynamic(() => import('@/components/datatable').then(mod => mod.NormalTable), { ssr: false });
export const RowExpansionTable = dynamic(() => import('@/components/datatable').then(mod => mod.RowExpansionTable), { ssr: false });
export const GoogleMapComponent = dynamic(() => import('@/components/map').then(mod => mod.GoogleMapComponent), { ssr: false });
export const GoogleMapMultiMarkerComponent = dynamic(() => import('@/components/map').then(mod => mod.GoogleMapMultiMarkerComponent), { ssr: false });
export const AudioRecorder = dynamic(() => import('@/components/audio'), { ssr: false });

// Modal exports are already dynamic in modal/index.js
export * from '@/components/modal';

// Static imports for small/frequently-used components
export { ValidationError } from '@/components/error';
export { NormalLabel } from '@/components/label';
export { ImageComponent } from '@/components/image';
export { NormalCheckBox } from '@/components/checkbox';
export { ToggleSwitch, InputSwitch } from '@/components/switch';
export { DND } from '@/components/dragNdrop';
export { Button, ButtonRounded } from '@/components/button';
export { InputFile } from '@/components/upload';
export { CardSpinner } from '@/components/spinner';
export { Input, TextArea, InputNumber, InputGroup, InputDropdown, MultiSelect, DropdownSelect, InputGroups, Password } from '@/components/input';
export { default as CustomHeader } from '@/components/customHeader';
export { DateTime, Calendar, DateTimeDisplay } from '@/components/date&time';
