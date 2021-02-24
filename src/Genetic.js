export default class Genetic {
    constructor(populationSize, epoches, createFunction, createInitValuesFunction, crossoverFunction) {
        this.populationSize = populationSize;
        this.epoches = epoches;
        this.createFunction = createFunction;

        this.population = [];
        this.createInitValuesFunction = createInitValuesFunction;
        this.crossoverFunction = crossoverFunction;
        this.init();
    }

    init() {
        this.population = Array(this.populationSize).fill(0).map(() => {
            const values = this.createInitValuesFunction();
            return {
                values,
                runner: this.createFunction(values),
            };
        });
    }

    run() {
        const errorArray = {
            min: { error: Infinity },
        };
        for (let i = 0; i < this.epoches; i += 1) {
            const trained = this.population.map((ant) => ({
                error: ant.runner.run(),
                ant,
            }));
            trained.sort((a, b) => a.error - b.error);
            if (trained[0].error < errorArray.min.error) {
                [errorArray.min] = trained;
            }
            this.updatePopulation(trained, i);
        }

        return {
            state: errorArray.min.ant.runner.getState(),
            c1: errorArray.min.c1,
            c2: errorArray.min.c2,
            error: errorArray.min.error,
            CalibrationLimit: errorArray.min.ant.runner.getCalibrationLimit(),
        };
    }

    updatePopulation(trained, epocheCount) {
        this.population = trained.map((data) => {
            const values = this.crossoverFunction(trained[0].ant.values, data.ant.values, epocheCount);
            return {
                values,
                runner: this.createFunction(values, data),
            };
        });
    }
}
