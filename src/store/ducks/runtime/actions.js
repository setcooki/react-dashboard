import types from "./types";

const updateRuntime = (data) => ({
  type: types.UPDATE_RUNTIME,
  data: {data}
});

export default {
  updateRuntime
}
