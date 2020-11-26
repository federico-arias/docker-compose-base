import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { OfficeDTO } from './office'
import { LineDTO } from './line'
import { TimeBlock, TimeBlockDto, ReservationTimeBlockDto } from './reservation'
import { OfficeHourIntervalDto } from './hours'
import { pathOr } from './util'
import { UserReservationResponseDto, UserReservation2ResponseDto } from "./reservation";

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}


abstract class HttpClient {
	protected readonly instance: AxiosInstance;
	bearerToken?: string;

	public constructor (baseURL: string) {
		this.instance = axios.create({
			baseURL
		})

		this._initializeResponseInterceptor()
	}

	private _initializeResponseInterceptor = () => {
		this.instance.interceptors.response.use(
			this._handleResponse,
			this._handleError
		)
	};

	private _handleResponse = ({ data }: AxiosResponse) => data;

	protected _handleError = (error: any) => {
		console.log('error.response', error.response)
		const reserveError = pathOr(error, ['response', 'data', 'errors', 'from'], false)
		if (reserveError) {
			throw new Error('zeroq-reservation-already-booked')
			return
		}
		return Promise.reject(error)
	}
}

export default class MainApi extends HttpClient implements IOfficeQuery, ILinesQuerier, IReserver {

	bearerToken?: string;

	public constructor (token?: string) {
		super('https://zeroq.cl/api/v1')
		this.bearerToken = token
	}

	public setToken (token: string) {
		this.bearerToken = token
	}

	public async getOffices (): Promise<Array<OfficeDTO>> {
		return this.instance.get<OfficeDTO[]>('/offices')
			.then((a: AxiosResponse): Array<OfficeDTO> => a.data)
	}

	public async getLines (officeId: number): Promise<Array<LineDTO>> {
		const id: string = String(officeId)
		return this.instance.get<LineDTO[]>(`/offices/${id}/lines`)
			.then((a: AxiosResponse): Array<LineDTO> => [].concat(a.data))
	}

	public async getOfficeHours (officeId: number): Promise<Array<OfficeHourIntervalDto>> {
		return this.instance.get<OfficeHourIntervalDto[]>(`/offices/${officeId}/hours`)
			.then((a: AxiosResponse): Array<OfficeHourIntervalDto> => [].concat(a.data))
			// .then(mapOfficeHourToTimeBlocks)
	}

	public async getReservedTimeBlocks (officeId: number): Promise<Array<ReservationTimeBlockDto>> {
		const from = YYYYmmdd()
		return this.instance.get<ReservationTimeBlockDto[]>(`/offices/${officeId}/reserves?from=${from}`)
			.then((a: AxiosResponse): Array<ReservationTimeBlockDto> => [].concat(a.data))
	}

	public async createReservation (from: string, to: string, line_id: number): Promise<any> {
		const config = {
			headers: { Authorization: `${this.bearerToken}` }
		}
		const dto: any = {
			reserve: {
				from,
				to,
				line_id
			}
		}
		return this.instance.post('/user/reserves', dto, config)
	}

	public async fetchUserReservations(): Promise<Array<UserReservationResponseDto>> {
		const config = {
			headers: { Authorization: `${this.bearerToken}` }
		}
		return this.instance.get<UserReservationResponseDto[]>(`/user/reserves`, config)
			.then((a: AxiosResponse): Array<UserReservationResponseDto> => [].concat(a.data));
	}

	public async deleteReservation(id: string): Promise<void> {
		const config = {
			headers: { Authorization: `${this.bearerToken}` }
		}

		return this.instance.delete<void>(`/user/reserves/${id}`, config)
			.then((a: AxiosResponse): void => {})
	}


}

export class ApiV2 extends HttpClient {
	public constructor () {
		super('https://zeroq.cl/api/v2')
	}

	public async getTimeBlocks (officeSlug: string, lineSlug: string, date: string): Promise<Array<TimeBlockDto>> {
		return this.instance.get<TimeBlockDto[]>(
			`/offices/${officeSlug}/${lineSlug}/${date}/timeblocks`
		)
			.then((a: AxiosResponse):Array<TimeBlockDto> => [].concat(a.data))
			// This should be on the client/caller
	}
	
}

export interface IReservationService {
	getTimeBlocks(officeSlug: string, lineSlug: string, date: string): Promise<Array<TimeBlockDto>>
}

export class ReservationService extends HttpClient implements IReservationService {
	public constructor (token: string) {
		super('https://zeroq.cl/services/reservations/api/v2')
		this.bearerToken = token;
	}

	public async deleteReservation(id: string): Promise<void> {
		const config = {
			headers: { Authorization: `${this.bearerToken}` }
		}
		return this.instance.delete<void>(`/${id}`, config)
			.then((a: AxiosResponse): void => {})
	}

	public async getTimeBlocks (officeSlug: string, lineSlug: string, date: string): Promise<Array<TimeBlockDto>> {
		const config = {
			headers: { Authorization: `${this.bearerToken}` }
		}
		return this.instance.get<TimeBlockDto[]>(
			`/offices/${officeSlug}/${lineSlug}/${date}/timeblocks`,
			config
		)
			.then(tap<AxiosResponse>("gtblk"))
			.then((a: AxiosResponse): Array<TimeBlockDto> => [].concat((a as any)));
	}

	public async getOfficeSettings(officeSlug: string): Promise<void> {
	}

	public setToken (token: string) {
		this.bearerToken = token;
	}

	public async fetchUserReservations(): Promise<Array<UserReservation2ResponseDto>> {
		const config = {
			headers: { Authorization: `${this.bearerToken}` }
		}
		return this.instance.get<Array<UserReservation2ResponseDto>>(`/user`, config)
			.then((a: AxiosResponse): Array<UserReservation2ResponseDto> => [].concat((a as any))
				  .filter(r => !(r as any).deleted_at));
	}
}
/*
export class MainApiMock implements IOfif{
	public async getOffices() {
	}
}
*/
const DEBUG = process.env.NODE_ENV !== 'production'

const tap = <T>(msg: string) => (a: T): T => {
	if (DEBUG) {
		console.log(msg, a)
	}
	return a
}

