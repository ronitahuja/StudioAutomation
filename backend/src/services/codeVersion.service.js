class codeVersionService {
    constructor(codeVersionRepository) {
        this.codeVersionRepository = codeVersionRepository;
    }
    async insertCodeVersions(codeVersionsData) {
        return await this.codeVersionRepository.insertCodeVersions(codeVersionsData);
    }
}

module.exports = codeVersionService;