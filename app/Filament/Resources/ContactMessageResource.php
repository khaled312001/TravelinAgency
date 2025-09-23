<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Resources\Resource;
use Filament\Resources\Forms\Form;
use Filament\Resources\Tables\Table;
use Filament\Resources\Forms\Components\TextInput;
use Filament\Resources\Forms\Components\Textarea;
use Filament\Resources\Forms\Components\Select;
use Filament\Resources\Forms\Components\Section;
use Filament\Resources\Tables\Columns\TextColumn;
use Filament\Resources\Tables\Filters\SelectFilter;
use Filament\Resources\Tables\Actions\Action;
use Filament\Resources\Tables\Actions\EditAction;
use Filament\Resources\Tables\Actions\DeleteAction;
use Filament\Resources\Tables\Actions\BulkActionGroup;
use Filament\Resources\Tables\Actions\DeleteBulkAction;
use Filament\Notifications\Notification;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationLabel = 'Contact Messages';

    protected static ?string $modelLabel = 'Contact Message';

    protected static ?string $pluralModelLabel = 'Contact Messages';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'subject';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Sender Information')
                    ->schema([
                        TextInput::make('name')
                            ->label('Name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        TextInput::make('phone')
                            ->label('Phone')
                            ->tel()
                            ->maxLength(255),
                    ]),

                Section::make('Message Content')
                    ->schema([
                        TextInput::make('subject')
                            ->label('Subject')
                            ->maxLength(255),
                        Textarea::make('message')
                            ->label('Message')
                            ->required()
                            ->rows(6),
                    ]),

                Section::make('Message Management')
                    ->schema([
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                ContactMessage::STATUS_UNREAD => 'Unread',
                                ContactMessage::STATUS_READ => 'Read',
                                ContactMessage::STATUS_REPLIED => 'Replied',
                                ContactMessage::STATUS_ARCHIVED => 'Archived',
                            ])
                            ->required(),
                        Textarea::make('admin_notes')
                            ->label('Admin Notes')
                            ->rows(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('phone')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('subject')
                    ->label('Subject')
                    ->searchable()
                    ->limit(50),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        ContactMessage::STATUS_UNREAD => 'danger',
                        ContactMessage::STATUS_READ => 'warning',
                        ContactMessage::STATUS_REPLIED => 'success',
                        ContactMessage::STATUS_ARCHIVED => 'secondary',
                        default => 'secondary',
                    })
                    ->formatStateUsing(fn ($state) => match($state) {
                        ContactMessage::STATUS_UNREAD => 'Unread',
                        ContactMessage::STATUS_READ => 'Read',
                        ContactMessage::STATUS_REPLIED => 'Replied',
                        ContactMessage::STATUS_ARCHIVED => 'Archived',
                        default => 'Unknown',
                    }),
                TextColumn::make('created_at')
                    ->label('Sent Date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('replied_at')
                    ->label('Replied Date')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        ContactMessage::STATUS_UNREAD => 'Unread',
                        ContactMessage::STATUS_READ => 'Read',
                        ContactMessage::STATUS_REPLIED => 'Replied',
                        ContactMessage::STATUS_ARCHIVED => 'Archived',
                    ]),
            ])
            ->actions([
                Action::make('mark_as_read')
                    ->label('Mark as Read')
                    ->icon('heroicon-o-eye')
                    ->color('success')
                    ->visible(fn (ContactMessage $record) => $record->status === ContactMessage::STATUS_UNREAD)
                    ->action(function (ContactMessage $record) {
                        $record->markAsRead();
                        Notification::make()
                            ->title('Message marked as read')
                            ->success()
                            ->send();
                    }),
                Action::make('mark_as_replied')
                    ->label('Mark as Replied')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (ContactMessage $record) => $record->status !== ContactMessage::STATUS_REPLIED)
                    ->action(function (ContactMessage $record) {
                        $record->markAsReplied();
                        Notification::make()
                            ->title('Message marked as replied')
                            ->success()
                            ->send();
                    }),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
            'edit' => Pages\EditContactMessage::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::unread()->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return static::getModel()::unread()->count() > 0 ? 'danger' : 'success';
    }
}
