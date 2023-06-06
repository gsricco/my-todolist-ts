// import {fetchTasksWorkerSaga} from "../tasks-sagas";
// import {call, put} from "redux-saga/effects";
// import {setAppStatusAC} from "../../../app/app-reducer";
// import {GetTasksResponse, TaskPriorities, TaskStatuses, todolistAPI} from "../../../api/todolists-api";
// import {setTasksAC} from "../tasks-reducer";
//
// test('fetchTsaks', ()=>{
//     const gen = fetchTasksWorkerSaga(({type: '',todolistId: 'td34'}))
//     let result = gen.next()
//     expect(result.value).toEqual(put(setAppStatusAC('loading')))
//
//     expect(gen.next().value).toEqual(call(todolistAPI.getTasks, 'td34'))
//
//     const fakeApiResponse:GetTasksResponse = {
//         error:'',
//         totalCount:1,
//         items:[{ id: "3", title: "tea", status: TaskStatuses.New, todoListId: 'td34',
//             description: '',
//             startDate: '',
//             deadline: '',
//             addedDate: '',
//             order: 0,
//             priority: TaskPriorities.Low }]
//     }
//
//     expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC(fakeApiResponse.items, 'td34')))
//     expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')))
// })

export{}