/**
 * Abstract Base Class for Diagnosis Providers
 * Allows pluggable AI or specialist model providers (e.g. Gemini, custom local vision model, etc.)
 */
class BaseDiagnosisProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Diagnoses crop photos with context
   * @param {Object} options
   * @param {string} options.crop - Crop name (e.g. Paddy, Cotton)
   * @param {string} options.lang - Target language ('en' | 'te')
   * @param {Array<string>} options.images - Array of base64 image strings (1 to 3)
   * @param {Object} options.context - Farmer context (stage, part, spread, weather, sprays)
   * @param {Array<Object>} options.kbDisorders - Reference disorders from KB for this crop
   * @returns {Promise<Object>} Structured diagnosis result
   */
  async diagnose(options) {
    throw new Error(`diagnose() not implemented by provider ${this.name}`);
  }
}

module.exports = BaseDiagnosisProvider;
