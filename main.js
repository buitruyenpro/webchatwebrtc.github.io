const socket = io("http://localhost:3000/");

socket.on("DANH_SACH_ONLINE", (arrUserInfo) => {
  arrUserInfo.forEach((user) => {
    const { ten, peerId } = user;
    $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
  });
});

socket.on("CO_NGUOI_DUNG_MOI", (user) => {
  const { ten, peerId } = user;
  $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
});

function openStream() {
  const config = { audio: true, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
const peer = new Peer({ key: "peerjs" });
peer.on("open", (id) => {
  $("#my-peer").append(id);
  $("#btnSignUp").click(() => {
    const username = $("#txtUsername").val();
    socket.emit("NGUOI_DUNG_DANG_KY", { ten: username, peerId: id });
  });
});

//Caller
$("#btnCall").click(() => {
  const id = $("#remoteId").val();
  openStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

//Callee
peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

$("#btnSignUp").click(() => {
  const username = $("#txtUsername").val();
  socket.emit("NGUOI_DUNG_DANG_KY", { ten: username });
});
