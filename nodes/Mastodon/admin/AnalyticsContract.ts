import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export function getAdminDateRange(
	this: IExecuteFunctions,
	i: number,
	fallback?: { startDate?: string; endDate?: string },
): { start_at: string; end_at: string } {
	const startAt = (this.getNodeParameter('start_at', i, '') as string) || fallback?.startDate || '';
	const endAt = (this.getNodeParameter('end_at', i, '') as string) || fallback?.endDate || '';
	const start = Date.parse(startAt);
	const end = Date.parse(endAt);
	if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
		throw new NodeOperationError(
			this.getNode(),
			'Admin metrics require a valid Start Date and End Date (end must not precede start).',
		);
	}
	return { start_at: startAt, end_at: endAt };
}
