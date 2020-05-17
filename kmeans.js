// import { zip, sample } from "underscore";

let _ = require("underscore");

class Cluster {
	constructor() {
		this.points = [];
		this.centroid = [];
	}

	calculateCentroid() {
		// Zip together the datasets so a mean can be calculated for elements in corresponding array indexes.
		let elements = _.zip(...this.points);

		this.centroid = [];

		// Calculate the average value for each coordinate and push it to the centroid.
		elements.forEach((element) => {
			this.centroid.push(element.reduce((a, b) => a + b, 0) / element.length);
		});
	}
}

class KMeans {
	constructor(k = 1, maxIterations = 5) {
		this.k = k;
		this.maxIterations = maxIterations;
	}

	assignCluster(clusters, point) {
		let shortestDist = Infinity;
		let nearestCluster;

		clusters.forEach((cluster) => {
			let distance = this.calculateDistance(cluster.centroid, point);

			if (distance < shortestDist) {
				shortestDist = distance;
				nearestCluster = cluster;
			}
		});

		nearestCluster.points.push(point);
	}

	calculateDistance(centroid, point) {
		let sumOfSquares = 0;

		for (let i = 0; i < centroid.length; i++) {
			sumOfSquares += Math.pow(centroid[i] - point[i], 2);
		}

		return Math.sqrt(sumOfSquares);
	}

	run(points, verbose = false) {
		// Start by picking k random centroids from our data set.
		const randomCentroids = _.sample(points, this.k);

		// Initialise an empty array to store the calculated cluster centroids.
		this.clusters = [];

		// Push an empty cluster to the array, and set its centroid coordinates to one of the random selections.
		for (let i = 0; i < this.k; i++) {
			this.clusters.push(new Cluster());
			this.clusters[i].centroid = randomCentroids[i];
			console.log(this.clusters[i].centroid);
		}

		// Debugging...kind of.
		// if (verbose) console.log(`Starting clusters are:\n${this.clusters}`);

		// Begin the body of the K-Means algorithm.
		let iterations = 0;
		while (iterations < this.maxIterations) {
			if (verbose) console.log(`\nIteration ${iterations}`);

			// Assign every point in our data set to its nearest cluster.
			points.forEach((point) => {
				this.assignCluster(this.clusters, point);
			});

			// Recalculate our clusters' centroids based on the new assignment of data points.
			this.clusters.forEach((cluster) => {
				cluster.calculateCentroid();

				if (verbose) console.log(`Centroid: ${cluster.centroid}`);
			});

			iterations++;
		}

		return this.clusters;
	}
}

// Example
// let kMeans = new KMeans(2, 10);
// let dataSet = [
// 	[2, 3],
// 	[5, 6],
// 	[8, 7],
// 	[8, 6],
// 	[3, 4],
// 	[6, 7],
// 	[2, 2],
// 	[1, 4],
// ];

// let result = kMeans.run(dataSet, (verbose = true));

// result.forEach((cluster) => {
// 	console.log(cluster.centroid);
// });

export { KMeans };
