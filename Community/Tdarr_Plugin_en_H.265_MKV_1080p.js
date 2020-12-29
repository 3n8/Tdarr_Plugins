function details() {
  return {
    id: "Tdarr_Plugin_en_H.265_MKV_1080p",
    Stage: "Pre-processing",
    Name: "H.265 MKV 1080p, copies all audio and first sub",
    Type: "Video",
    Description: `[Contains built-in filter] This plugin copies all audio and first subtitle stream and makes sure the video is h265 1080p mkv. \n\n
`,
    Version: "1.00",
    Link:
      "https://github.com/3n8/Tdarr_Plugins/blob/master/Community/Tdarr_Plugin_en_H.265_MKV_1080pjs",
    Tags: "pre-processing,handbrake,ffmpeg,h264",
  };
}

function plugin(file) {
  //Must return this object

  var response = {
    processFile: false,
    preset: "",
    container: ".mp4",
    handBrakeMode: false,
    FFmpegMode: false,
    reQueueAfter: false,
    infoLog: "",
  };

  response.FFmpegMode = true;

  if (file.fileMedium !== "video") {
    console.log("File is not video");

    response.infoLog += "☒File is not video \n";
    response.processFile = false;

    return response;
  } else {
    var jsonString = JSON.stringify(file);

    var hasSubs = false;
    for (var i = 0; i < file.ffProbeData.streams.length; i++) {
      try {
        if (
          file.ffProbeData.streams[i].codec_type.toLowerCase() == "subtitle"
        ) {
          hasSubs = true;
        }
      } catch (err) {}
    }

    //

    if (
      file.ffProbeData.streams[0].width > 1920
    ) {
      response.processFile = true;
      response.preset = ",-map 0:v:0 -c:v libx265 -vf scale=-1:1080 -x265-params crf=21:bframes=8 -map 0:a:0 -c:a copy -map 0:s? -c:s copy -max_muxing_queue_size 9999 -metadata:s:v:0 tdarrprocessed=yes";
      response.container = ".mkv";
      response.handBrakeMode = false;
      response.FFmpegMode = true;
      response.reQueueAfter = true;
      response.infoLog += "☒File is above 1080p! encoding scaling down to 1080p! \n";
      return response;
    } else {
      if (
        file.ffProbeData.streams[0].codec_name != "hevc" && file.ffProbeData.streams[0].width <= 1920
      ) {
        response.processFile = true;
        response.preset = ",-map 0:v:0 -c:v libx265 -x265-params crf=21:bframes=8 -map 0:a:0 -c:a copy -map 0:s? -c:s copy -max_muxing_queue_size 9999 -metadata:s:v:0 tdarrprocessed=yes";
        response.container = ".mkv";
        response.handBrakeMode = false;
        response.FFmpegMode = true;
        response.reQueueAfter = true;
        response.infoLog += "☒File is at 1080p! or below encoding without scaling\n";
        return response;
      }
    }

    response.processFile = false;
    response.infoLog += "☑File meets conditions! \n";
    return response;
  }
}

module.exports.details = details;
module.exports.plugin = plugin;
