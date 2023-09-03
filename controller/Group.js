import express from 'express'
import mongoose from 'mongoose'
import Group from '../model/Group.js'
import Account from '../model/Account.js'
import GroupChat from '../model/GroupChat.js'
import fs from 'fs'
export const getAllGroup = async (req, res) => {
  const account = await Account.findOne({
    _id: req.body.from_id,
  })
  if (account != null) {
    Group.find(
      {
        _id: {
          $in: account.group,
        },
      },
      (err, results) => {
        if (!err) {
          res.json(results)
        } else {
          console.log(err)
        }
      },
    )
  }
}
export const createGroup = async (req, res) => {
  //Tạo nhóm mới
  const group = new Group({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.groupName,
  })
  Group.create(group)
  //Tìm kiếm account và thêm group mới tạo vào account
  const account = await Account.findOne({
    _id: req.body._id,
  })
  if (account === null) {
    res.json(null)
  } else {
    let groupObject = {
      _id: group._id,
    }
    let groupArray = [...account.group, groupObject]
    await Account.findOneAndUpdate(
      {
        _id: account._id,
      },
      {
        group: groupArray,
      },
    )
    //Thực hiện mời các thành viên vào group mới tạo
    for (var i = 0; i < req.body.groupAccounts.length; i++) {
      Account.findOne(
        {
          email: req.body.groupAccounts[i],
        },
        async (err, result) => {
          if (!err) {
            let groupInvite = [...result.group, groupObject]
            await Account.findOneAndUpdate(
              {
                _id: result._id,
              },
              {
                group: groupInvite,
              },
            )
          }
        },
      )
    }
    res.json(group)
  }
}
export const joinGroup = async (req, res) => {
  let account = await Account.findOne({
    _id: req.body._id,
  })
  if (account !== null) {
    let group = await Group.findOne({
      _id: req.body.group_id,
    })
    if (group === null) {
      res.json(null)
    } else {
      let newGroupArray = [
        ...account.group,
        {
          _id: req.body.group_id,
        },
      ]
      await Account.findOneAndUpdate(
        {
          _id: account._id,
        },
        {
          group: newGroupArray,
        },
      )
      res.json(group)
    }
  } else res.json(null)
}
export const leaveGroup = async (req, res) => {
  //Tìm kiếm tài khoản cần rời nhóm
  let account = await Account.findOne({
    _id: req.body._id,
  })
  if (account !== null) {
    //Tìm kiếm và truy xuất nhóm cần rời
    let newGroupArray = account.group
    for (var i = 0; i < newGroupArray.length; i++) {
      if (req.body.group_id === newGroupArray[i]._id?.toString()) {
        newGroupArray.splice(newGroupArray.indexOf(newGroupArray[i]), 1)
        break
      }
    }
    //Cập nhật lại tài khoản mới
    await Account.findOneAndUpdate(
      {
        _id: account._id,
      },
      {
        group: newGroupArray,
      },
    )
    //Tìm kiếm nhóm vừa bị xoá khỏi tài khoản
    let group = await Group.findOne({
      _id: req.body.group_id,
    })
    //Kiểm tra thử là có còn ai tồn đọng trong nhóm
    if (checkAnyAccountLeftInTheGroup(await Account.find({}), group?._id) === false) {
      //Xoá ảnh thuộc về nhóm
      let groupChat = await GroupChat.find({
        to_id: group?._id,
        chatCategory: '1',
      })
      let path = __dirname.replace('/controller', '')
      for (let i = 0; i < groupChat.length; i++) {
        if (fs.existsSync(`${path}/public/images/${groupChat[i].content}`)) {
          fs.unlink(`${path}/public/images/${groupChat[i].content}`, (err) => {
            if (err) console.log(err)
            console.log(`Successfully deleted ${groupChat[i].content}`)
          })
        }
      }
      //Xoá hết tất cả đoạn chat đến group này
      await GroupChat.deleteMany({
        to_id: group?._id,
      })
      //Xoá nhóm
      await Group.findOneAndDelete({
        _id: group?._id,
      })
    } else {
      //Chuyển đổi người dùng thành -> Thành viên đã bị xoá khỏi nhóm
      let groupChat = await GroupChat.find({
        from_id: account._id,
        to_id: group?._id,
        chatCategory: '1',
      })
      //Xoá ảnh của những người đã rời khỏi nhóm
      let path = __dirname.replace('/controller', '')
      for (let i = 0; i < groupChat.length; i++) {
        if (fs.existsSync(`${path}/public/images/${groupChat[i].content}`)) {
          fs.unlink(`${path}/public/images/${groupChat[i].content}`, (err) => {
            if (err) console.log(err)
            console.log(`Successfully deleted ${groupChat[i].content}`)
          })
        }
      }
      await GroupChat.updateMany(
        {
          from_id: account._id,
          to_id: group?._id,
        },
        {
          content: 'The message was deleted!!',
        },
      )
    }
    res.json(group)
  } else {
    res.json(null)
  }
}
const checkAnyAccountLeftInTheGroup = (allAccount, group_id) => {
  for (var i = 0; i < allAccount.length; i++) {
    for (var k = 0; k < allAccount[i].group.length; k++) {
      if (allAccount[i].group[k]._id.toString() === group_id.toString()) {
        return true
      }
    }
  }
  return false
}
