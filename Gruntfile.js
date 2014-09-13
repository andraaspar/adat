module.exports = function(grunt) {
	
	grunt.initConfig({
		clean: {
			compile: ['tmp']
		},
		sas: {
			update: {}
		},
		shell: {
			update: {
				command: [
					'bower update',
					'bower prune',
					'bower install'
				].join('&&')
			}
		},
		typescript: {
			compile: {
				files: {
					'build/script/test.js': 'test/test1/Main.ts'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sas');
	grunt.loadNpmTasks('grunt-typescript');

	grunt.registerTask('update', ['shell:update','sas:update']);
	grunt.registerTask('compile', ['clean:compile','typescript:compile']);
	grunt.registerTask('default', ['compile']);
};