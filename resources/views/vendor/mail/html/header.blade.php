@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel' || trim($slot) === config('app.name'))
<img src="https://www.rania.co.id/logo.png" class="logo" alt="RANIA Logo" style="height: 80px; max-height: 80px; object-fit: cover;">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
