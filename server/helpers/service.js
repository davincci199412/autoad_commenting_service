const User = require('../models/user');
const PopularUser = require('../models/popularuser');
const Post = require('../models/post');
const Comment = require('../models/comment');
const moment = require('moment');
const isEmpty = require('../validations/is-empty');
const sleep = require('./utility').sleep;
const Instagram = require('instagram-web-api');

const instagram_username = process.env.INSTAGRAM_USERNAME;
const instagram_password = process.env.INSTAGRAM_PASSWORD;

const service_start_time = moment().valueOf();
let auto_increasment = 0;

exports.autoComment = async function autoComment() {
    try {
        const client = new Instagram({ username: instagram_username, password: instagram_password });
        await client.login();
        const popularUsers = await PopularUser
        .find()
            .populate([
                {
                    path: 'added_users',
                    select: '_id username password userId auto_comment_text'
                },
                {
                    path: 'posts',
                    select: 'id shortcode'
                }
            ])
            .exec();

        if (!isEmpty(popularUsers)) {
            for (let i=0; i<popularUsers.length; i++) {
                try {
                    const person = popularUsers[i];
                    const addedUser = person.added_users;

                    
                    const profile = await client.getUserByUsername({ username: person.username });
                    const currentPosts = profile['edge_owner_to_timeline_media']['edges'];
                    for (let j=0; j<currentPosts.length; j++) {
                        const post = currentPosts[j];
                        const postId = post.node.id;
                        const shortcode = post.node.shortcode;
                        const caption = post.node['edge_media_to_caption']['edges'][0]['node']['text'];
                        const posted_time = post.node['taken_at_timestamp'] * 1000;
                        const like_count = post.node['edge_liked_by']['count'];
                        const comment_count = post.node['edge_media_to_comment']['count'];
                        const person_data = await PopularUser.findById(person._id)
                        .populate([
                            {
                                path: 'posts',
                                select: 'id shortcode'
                            }
                        ])
                        .exec();
                        const oldPosts = person_data.posts;
                        const index = oldPosts.findIndex(item => item.id === postId);
                        if (index === -1 && (parseInt(posted_time) > parseInt(service_start_time))) {
                            
                            auto_increasment++;
                            console.log(">>>>>>>>>>>> found new post <<<<<<<<<<<<<<<<<<<");
                            console.log(post)
                            const newPost = new Post({
                                posted_user: person._id,
                                id: postId,
                                shortcode,
                                caption,
                                posted_time,
                                like_count,
                                comment_count
                            });
                            
                            const result = await newPost.save();
                            oldPosts.push(result._id);
                            await PopularUser.updateOne({ userId: person.userId }, { posts: oldPosts }, { upsert: true, new: true });
                            
                            for (k=0; k<addedUser.length; k++) {
                                try {
                                    const user = addedUser[k];
                                    const { _id, username, password, auto_comment_text } = user;
                                    const post_data = await Post.findById(result._id).exec();
                                    const oldComments = post_data.comments;
                                    if (!isEmpty(auto_comment_text)) {
                                        const index = auto_increasment%auto_comment_text.length;
                                        const userClient = new Instagram({ username, password });
                                        await userClient.login();
                                        const comment = await userClient.addComment({ mediaId: postId, text: auto_comment_text[index] });
                                        if (comment.status === "ok") {
                                            const newComment = new Comment({
                                                user: _id,
                                                post: result._id,
                                                posted_username: person.username,
                                                comment_id: comment.id,
                                                text: comment.text,
                                                commented_time: comment.created_time * 1000
                                            });
                                            const result2 = await newComment.save();
                                            oldComments.push(result2._id);
                                            await Post.updateOne({ id: postId }, { comments: oldComments }, { upsert: true, new: true });
                                            console.log(" >>>>>>>>>> auto comment success <<<<<<<<<<<<<")
                                            console.log(username)        
                                            sleep(30*1000)
                                        }
                                    }
                                } catch (error) {
                                    console.log(" >>>>>>>>>> auto comment failed <<<<<<<<<<<<<")
                                    console.log(error)
                                    sleep(2*60*1000)
                                }
                            }
                        }
                    }
                    if (currentPosts.length === 0){
                        sleep(30*1000)
                    }
                } catch (error) {
                    console.log(error)
                    sleep(2*60*1000)
                }
            }
           
        }
        console.log(">>>>>>>>>>>> auto comment finished <<<<<<<<<<<<<<<<<<<")
        sleep(5*60*1000)
        autoComment();
    } catch (error) {
        console.log(error)
        sleep(2*60*1000)
        autoComment();
    }
};
