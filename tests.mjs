import ffmpeg from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg')

let duration ='-t 10'

let base_concat = new Promise((resolve, reject) => {
    console.time('base_concat');
    ffmpeg().input('./concat.txt').inputOptions(['-f concat', '-safe 0']).complexFilter([`fps=24`]) // .outputOptions(['-c:a copy', '-c:v h264', '-preset superfast'])
        .on('error', function (err) {
        reject(err);
        })
        .on('end', function () {
            console.timeEnd('base_concat');
        resolve();
        })
        .save('./base_concat.mp4')
        .run();
    })

let copy_concat = new Promise((resolve, reject) => {
    console.time('copy_concat');
    ffmpeg().input('./concat.txt')
        .inputOptions(['-f concat', '-safe 0']) // .outputOptions(['-c:a copy', '-c:v h264', '-preset superfast'])
        .outputOptions(['-c:v copy'])
        .on('error', function (err) {
        reject(err);
        })
        .on('end', function () {
            console.timeEnd('copy_concat');
        resolve();
        })
        .save('./copy_concat.mp4')
        .run();
    })

let gpu_concat = new Promise((resolve, reject) => {
    console.time('gpu_concat');
    ffmpeg().input('./concat.txt')
        .inputOptions(['-f concat', '-safe 0', '-hwaccel cuvid', '-vsync 0', '-hwaccel_output_format cuda']).complexFilter([`fps=24`]) // .outputOptions(['-c:a copy', '-c:v h264', '-preset superfast'])
        .outputOptions(['-c:v h264_nvenc']) //this should speed things up but its not werking
        .on('error', function (err) {
        reject(err);
        })
        .on('end', function () {
            console.timeEnd('gpu_concat');
        resolve();
        })
        .save('./gpu_concat.mp4')
        .run();
    })



console.log('Concat Tests:')
await Promise.all([base_concat, copy_concat, gpu_concat])

let base_blank = new Promise((resolve, reject) =>{
    console.time('base_blank');
    ffmpeg(`color=size=1920x1080:rate=24:color=black`).inputFormat('lavfi').input('anullsrc=channel_layout=stereo:sample_rate=48000').inputFormat('lavfi')
        .outputOptions([duration])
        .on('error', function (err) {
        reject(err);
        })
        .on('end', function () {
            console.timeEnd('base_blank');
        resolve();
        })
        .save('./blank_base.mp4')
        .run();
});

let gpu_blank = new Promise((resolve, reject) =>{
    console.time('gpu_blank');
    ffmpeg(`color=size=1920x1080:rate=24:color=black`).inputFormat('lavfi').input('anullsrc=channel_layout=stereo:sample_rate=48000').inputFormat('lavfi')
        .inputOptions(['-hwaccel cuvid', '-vsync 0', '-hwaccel_output_format cuda'])
        .outputOptions([duration, '-c:v h264_nvenc'])
        .on('error', function (err) {
        reject(err);
        })
        .on('end', function () {
            console.timeEnd('gpu_blank');
        resolve();
        })
        .save('./blank_base.mp4')
        .run();
});
console.log('Blank Tests:')
await Promise.all([base_blank, gpu_blank])

let base_fps_reduce = new Promise((resolve, reject) => {
    console.time('base_fps_reduce');
    ffmpeg().input('./blank_black.mp4').complexFilter(['fps=12']).outputOptions(['-c:a copy'])
      .on('error', function (err) {
        reject(err);
      })
      .on('end', function () {
        console.timeEnd('base_fps_reduce')
        resolve();
      })
      .save('./base_fps_reduce.mp4')
      .run();
  });

let gpu_fps_reduce = new Promise((resolve, reject) => {
    console.time('gpu_fps_reduce');
    ffmpeg().input('./blank_black.mp4')
        .complexFilter(['fps=12'])
        .inputOptions(['-hwaccel cuvid', '-vsync 0', '-hwaccel_output_format cuda'])
        .outputOptions(['-c:a copy', '-c:v h264_nvenc'])
        .on('error', function (err) {
        reject(err);
        })
      .on('end', function () {
        console.timeEnd('gpu_fps_reduce')
        resolve();
      })
      .save('./gpu_fps_reduce.mp4')
      .run();
  });

let base_fps_increase = new Promise((resolve, reject) => {
    console.time('base_fps_increase');
    ffmpeg().input('./blank_black.mp4').complexFilter(['fps=48']).outputOptions(['-c:a copy'])
      .on('error', function (err) {
        reject(err);
      })
      .on('end', function () {
        console.timeEnd('base_fps_increase')
        resolve();
      })
      .save('./base_fps_increase.mp4')
      .run();
  });

let gpu_fps_increase = new Promise((resolve, reject) => {
    console.time('gpu_fps_increase');
    ffmpeg().input('./blank_black.mp4')
        .complexFilter(['fps=48'])
        .inputOptions(['-hwaccel cuvid', '-vsync 0', '-hwaccel_output_format cuda'])
        .outputOptions(['-c:a copy', '-c:v h264_nvenc'])
        .on('error', function (err) {
        reject(err);
        })
      .on('end', function () {
        console.timeEnd('gpu_fps_increase')
        resolve();
      })
      .save('./gpu_fps_increase.mp4')
      .run();
  });

console.log('FPS Tests:')
await Promise.all([base_fps_reduce, gpu_fps_reduce, base_fps_increase, gpu_fps_increase])