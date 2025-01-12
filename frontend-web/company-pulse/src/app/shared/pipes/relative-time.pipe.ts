// relative-time.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  pure: false,
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  }
}