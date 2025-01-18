import { AxiosInstance } from "axios";

import { backend } from "services/backend";
import { obj2query } from "utils/urls";

type UseApiOptions = {
  service?: AxiosInstance;
  version?: string;
  endpoint?: BackendEndpoint;
  actionEndpoint?: string;
};

export function useApi(
  defaultEndpoint?: BackendEndpoint,
  defaultOptions?: UseApiOptions
) {
  function normalizeOptions(requestOptions?: UseApiOptions) {
    const service =
      requestOptions?.service ?? defaultOptions?.service ?? backend;
    const version = requestOptions?.version ?? defaultOptions?.version ?? "v1";
    const endpoint = requestOptions?.endpoint ?? defaultEndpoint;
    const actionEndpoint = requestOptions?.actionEndpoint
      ? `${requestOptions.actionEndpoint}/`
      : "";

    return { service, version, endpoint, actionEndpoint };
  }

  async function sendGetList<T>(
    filtros = {},
    options?: UseApiOptions
  ): Promise<ListBackendResponse<T>> {
    const { service, version, endpoint, actionEndpoint } =
      normalizeOptions(options);

    const urlParams = obj2query(filtros);

    return await service
      .get(`${version}/${endpoint}/${actionEndpoint}?${urlParams}`)
      .then((res) => ({
        $ok: true,
        $status: res.status,
        ...res.data,
      }))
      .catch((err) => {
        throw {
          $ok: false,
          $status: err.response ? err.response.status : null,
          ...(err.response ? { erro: err.response.data } : {}),
        };
      });
  }

  async function sendGetRetrieve<T>(
    id: number,
    options?: UseApiOptions
  ): Promise<T> {
    const { service, version, endpoint, actionEndpoint } =
      normalizeOptions(options);

    return await service
      .get(`${version}/${endpoint}/${id}/${actionEndpoint}`)
      .then((res) => ({
        $status: res.status,
        ...res.data,
      }))
      .catch((err) => {
        throw {
          $status: err.response ? err.response.status : null,
          ...(err.response ? err.response.data : {}),
        };
      });
  }

  async function sendGetRetrieveByFilters<T>(
    filtros = {},
    options?: UseApiOptions
  ): Promise<any> {
    const { service, version, endpoint, actionEndpoint } =
      normalizeOptions(options);

    const urlParams = obj2query(filtros);

    return await service
      .get(`${version}/${endpoint}/?${urlParams}`)
      .then((res) => ({
        $status: res.status,
        $ok: true,
        registro: res.data.resultados[0] ?? null,
      }))
      .catch((err) => {
        throw {
          $status: err.response ? err.response.status : null,
          $ok: false,
          ...(err.response ? err.response.data : {}),
        };
      });
  }

  async function sendPost<T>(dados: {}, options?: UseApiOptions): Promise<T> {
    const { service, version, endpoint, actionEndpoint } = normalizeOptions(options);

    console.log(actionEndpoint);
    

    const uri = `${version}/${endpoint}/${actionEndpoint}`;
    return await service
      .post(uri, dados)
      .then((res) => ({
        $status: res.status,
        ...res.data,
      }))
      .catch((err) => {
        throw {
          $status: err.response ? err.response.status : null,
          ...(err.response ? err.response.data : {}),
        };
      });
  }

  async function sendPatch(
    id: number,
    dados: {},
    options?: UseApiOptions
  ): Promise<any> {
    const { service, version, endpoint } = normalizeOptions(options);

    return await service
      .patch(`${version}/${endpoint}/${id}/`, dados)
      .then((res) => ({
        $status: res.status,
        ...res.data,
      }))
      .catch((err) => {
        throw {
          $status: err.response ? err.response.status : null,
          ...(err.response ? err.response.data : {}),
        };
      });
  }

  async function sendPut(
    id: number,
    dados: {},
    options?: UseApiOptions
  ): Promise<any> {
    const { service, version, endpoint, actionEndpoint } =
      normalizeOptions(options);

    return await service
      .put(`${version}/${endpoint}/${id}/${actionEndpoint}`, dados)
      .then((res) => ({
        $status: res.status,
        ...res.data,
      }))
      .catch((err) => {
        throw {
          $status: err.response ? err.response.status : null,
          ...(err.response ? err.response.data : {}),
        };
      });
  }

  async function sendDelete(options?: UseApiOptions) {
    const { service, version, endpoint } = normalizeOptions(options);

    const uri = `${version}/${endpoint}/`;
    const response = await service
      .put(uri)
      .then(() => null)
      .catch((err) => ({
        $status: err.response ? err.response.status : null,
        ...(err.response ? err.response.data : {}),
      }));

    return response;
  }

  return {
    sendGetList,
    sendGetRetrieve,
    sendGetRetrieveByFilters,
    sendPost,
    sendPatch,
    sendPut,
    sendDelete,
  };
}
