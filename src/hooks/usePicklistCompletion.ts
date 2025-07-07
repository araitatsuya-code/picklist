import { useCallback } from 'react';
import { usePicklistStore } from '../stores/usePicklistStore';
import { useShoppingHistoryStore } from '../stores/useShoppingHistoryStore';

/**
 * 買い物リスト完了機能を提供するカスタムフック
 * PicklistストアとShoppingHistoryストアを統合し、
 * リスト完了時に履歴保存を自動的に行う
 */
export const usePicklistCompletion = () => {
  const { picklists, completePicklist } = usePicklistStore();
  const { addHistory } = useShoppingHistoryStore();

  /**
   * 買い物リストを完了する
   * 1. 履歴ストアに保存
   * 2. 買い物リストから削除
   */
  const completeList = useCallback((listId: string) => {
    // 完了するリストを取得
    const listToComplete = picklists.find(list => list.id === listId);
    
    if (!listToComplete) {
      console.warn(`List with id ${listId} not found`);
      return false;
    }

    try {
      // 1. 履歴に保存
      addHistory(listToComplete);
      
      // 2. 買い物リストから削除
      completePicklist(listId);
      
      return true;
    } catch (error) {
      console.error('Failed to complete list:', error);
      return false;
    }
  }, [picklists, addHistory, completePicklist]);

  /**
   * リストの完了可能性をチェック
   * @param listId リストID
   * @returns 完了可能かどうか
   */
  const canCompleteList = useCallback((listId: string) => {
    const list = picklists.find(l => l.id === listId);
    return !!list;
  }, [picklists]);

  /**
   * リストの完了率を取得
   * @param listId リストID
   * @returns 完了率（0-100）
   */
  const getCompletionRate = useCallback((listId: string) => {
    const list = picklists.find(l => l.id === listId);
    if (!list || list.items.length === 0) return 0;
    
    const completedItems = list.items.filter(item => item.completed).length;
    return Math.round((completedItems / list.items.length) * 100);
  }, [picklists]);

  /**
   * リストの統計情報を取得
   * @param listId リストID
   */
  const getListStats = useCallback((listId: string) => {
    const list = picklists.find(l => l.id === listId);
    if (!list) return null;
    
    const totalItems = list.items.length;
    const completedItems = list.items.filter(item => item.completed).length;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return {
      totalItems,
      completedItems,
      remainingItems: totalItems - completedItems,
      completionRate,
      isComplete: completionRate === 100,
    };
  }, [picklists]);

  return {
    completeList,
    canCompleteList,
    getCompletionRate,
    getListStats,
  };
};