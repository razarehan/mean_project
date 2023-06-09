import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  postsSubs = new Subject<Post[]>();


  constructor(private httpClient: HttpClient, private router: Router) { }

  getPost(id: string) {
    return this.httpClient.get<{message: string, post:any}>(BACKEND_URL + id);
  }
  getPosts() {
    this.httpClient.get<{message: string, posts: any}>(BACKEND_URL)
      .pipe(map((postData) => {
        return postData.posts.map((post:any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            creator: post.creator
          }
        });
      }))
      .subscribe((transformedPost) => {
        console.log(transformedPost);
        this.posts = transformedPost;
        this.postsSubs.next(this.posts.slice());
      })
  }

  addPosts(post: Post) {
    this.httpClient.post<{ message: string, post:any }>(BACKEND_URL, post)
      .pipe(map((postData)=> {
          return {
            title: postData.post.title,
            content: postData.post.content,
            id: postData.post._id,
            creator: postData.post.creator
          }
      }))
      .subscribe((transformedData) => {
         this.posts.push(transformedData);
         this.postsSubs.next(this.posts.slice());
         this.router.navigate(['/']);
      })
  }

  updatePost(id: string, title: string, content: string, creator: string) {
    const post: Post = {id: id, title:title, content: content, creator:creator};
    this.httpClient.put<{ message: string, post: any }>(BACKEND_URL + id, post)
      .subscribe((responseData) => {
        const updatedPosts = this.posts.slice();
        const oldPostIndex = updatedPosts.findIndex(post => post.id === id);
        updatedPosts[oldPostIndex] = post;
        this.postsSubs.next(this.posts.slice());
        this.router.navigate(['/']);
      })
  }
  deletePost(id: string) {
    this.httpClient.delete<{ message: string, post: any }>(BACKEND_URL + id)
      .subscribe((responseData) => {
        const updatedPosts = this.posts.filter(post => post.id != id);
        this.posts = updatedPosts;
        this.postsSubs.next(this.posts.slice());
     })
  }
}
