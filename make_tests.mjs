import ffmpeg from 'fluent-ffmpeg'
import { writeFile } from 'fs'

let duration = '-t 10';

ffmpeg(`color=size=1920x1080:rate=24:color=black`).inputFormat('lavfi').input('anullsrc=channel_layout=stereo:sample_rate=48000').inputFormat('lavfi')
        .outputOptions([duration])
        .on('error', function (err) {
        })
        .on('start', ()=>{
          console.time('ffmpeg duration');
        })
        .on('end', ()=> console.timeEnd('ffmpeg duration'))
        .save('./blank_black.mp4')
        .run();
// console.timeEnd('makevid')

ffmpeg(`color=size=1920x1080:rate=24:color=white`).inputFormat('lavfi').input('anullsrc=channel_layout=stereo:sample_rate=48000').inputFormat('lavfi')
        .outputOptions([duration])
        .on('error', function (err) {
        })
        .on('end', function () {
          // console.log('finished running blank at end of camera');
          // resolve();
        })
        .save('./blank_white.mp4')
        .run();
ffmpeg(`color=size=1920x1080:rate=24:color=red`).inputFormat('lavfi').input('anullsrc=channel_layout=stereo:sample_rate=48000').inputFormat('lavfi')
        .outputOptions([duration])
        .on('error', function (err) {
        })
        .on('end', function () {
          // console.log('finished running blank at end of camera');
          // resolve();
        })
        .save('./blank_red.mp4')
        .run();
ffmpeg(`color=size=1920x1080:rate=24:color=green`).inputFormat('lavfi').input('anullsrc=channel_layout=stereo:sample_rate=48000').inputFormat('lavfi')
        .outputOptions([duration])
        .on('error', function (err) {
        })
        .on('end', function () {
          // console.log('finished running blank at end of camera');
          // resolve();
        })
        .save('./blank_green.mp4')
        .run();

writeFile('./concat.txt', "file './blank_black.mp4'\nfile './blank_black.mp4'\nfile './blank_black.mp4'\nfile './blank_black.mp4'\n", err => {
          if (err) {
            console.error(err)
            return
          }
        })