type JsonRecord = Record<string, unknown>;

export const toJSONOptions = (hiddenFields: string[] = []) => ({
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: JsonRecord) => {
    ret.id = String(ret._id);
    delete ret._id;
    for (const field of hiddenFields) delete ret[field];
    return ret;
  },
});
